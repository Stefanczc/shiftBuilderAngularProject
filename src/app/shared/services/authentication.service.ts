import { Injectable, NgZone } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Firestore } from "@angular/fire/firestore";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { BehaviorSubject, Subject } from "rxjs";
import { ShareDataService } from "./share-data.service";
import { NavigationEnd, Router } from "@angular/router";
import { ROUTE_ADMIN_HOMEPAGE, ROUTE_HOMEPAGE, ROUTE_LOGIN } from "src/app/app-routing.module";
import { ModalService } from "./modal.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private uidSubject = new BehaviorSubject<string | null>(null);
  uid$ = this.uidSubject.asObservable();

  private uidReadySubject = new Subject<void>();
  uidReady$ = this.uidReadySubject.asObservable();

  constructor (
    private firestore: Firestore,
    private zone: NgZone,
    private sharedDataService: ShareDataService,
    private router: Router,
    private modalService: ModalService
  ) 
    {
    this.initAuth();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('/login') || event.url.includes('/register')) {
          this.logout();
        }
      }
    })
  }

  get uid(): string | null {
    return this.uidSubject.value;
  }

  initAuth() {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      this.zone.run(async () => {
        if (user) {
          this.uidSubject.next(user.uid);
          this.isLoggedInSubject.next(true);
          this.uidReadySubject.next();  
          await this.getUserData(user.uid);
        } else {
          this.uidSubject.next(null);
          this.isLoggedInSubject.next(false);
        }
      });
    });
  }

  async getUserData(userId: string) {
    const userCollection = collection(this.firestore, 'users');
    const userRef = doc(userCollection, userId);
    const user = await getDoc(userRef);
    this.sharedDataService.setUserData(user.data());
  }

  async registerUser(registerForm: FormGroup) {
    if (registerForm.valid) {
      const auth = getAuth();
      const formData = registerForm.value;
      
      try {
        const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
       
        if (user) {
          this.uidSubject.next(user.uid);
          const userId = user.uid;

          this.sharedDataService.setUserData({
            email: user.email,
            firstname: formData.firstName,
            lastName: formData.lastName,
            birthdate: formData.birthdate,
            userId: user.uid,
            role: 'user',
            isDisabled: false,
          })

          const userData = { ...formData, uid: user.uid, role: 'user', isDisabled: false };
          const userCollection = collection(this.firestore, 'users');
          const userRef = doc(userCollection, userId);
          await setDoc(userRef, userData);
        }
      } catch (error: any) {
        console.error('Error registering user:', error);
        throw error;
      }
    } else {
      throw new Error('Form validation failed');
    }
  }

  async loginUser(loginForm: FormGroup) {
    if (loginForm.valid) {
        const auth = getAuth();
        const formData = loginForm.value;

        try {
            const { user } = await signInWithEmailAndPassword(auth, formData.email, formData.password);

            if (user) {
                this.uidSubject.next(user.uid);
                const userData = await this.sharedDataService.getUserByUid(user.uid);

                if (userData?.isDisabled) {
                    throw new Error('User is disabled');
                }

                if (formData.email === 'admin@admin.ro') {
                    const userCollection = collection(this.firestore, 'users');
                    const userRef = doc(userCollection, user.uid);
                    await setDoc(userRef, { role: 'admin' }, { merge: true });
                    this.router.navigate([`/${ROUTE_ADMIN_HOMEPAGE}`]);
                } else {
                    this.router.navigate([`/${ROUTE_HOMEPAGE}`]);
                }
            }
          localStorage.setItem('userLoggedIn', 'true');
          setTimeout(() => {
            this.logout();
            this.modalService.openSessionModal('Error', 'Your session expired!', 'error');
            this.router.navigate([`${ROUTE_LOGIN}`]);
          }, 900000);
          this.isLoggedInSubject.next(true);
        }
        catch (error: any) {
          console.error('Error logging in:', error);
          this.isLoggedInSubject.next(false);
          throw error;
        }
    } else {
        throw new Error('Form validation failed');
    }
  }

  async logout() {
    const auth = getAuth();
    await signOut(auth);
    localStorage.removeItem('userLoggedIn');
    console.log('User logged out.');
  }
  
}
