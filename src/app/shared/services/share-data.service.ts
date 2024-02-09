import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
  private loginFormData: any;

  private _userData = new BehaviorSubject<any>({});
  userData$ = this._userData.asObservable();

  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();
  
  constructor(private firestore: Firestore) { }

  //move to auth service

  setLoginFormData(data: any) {
    this.loginFormData = data;
  }

  getLoginFormData() {
    return this.loginFormData;
  }

  setUserData(data: any) {
    this._userData.next(data);
  }

  getUserData() {
    const userData = this._userData.value;
    return userData;
  }

  get userData() {
    return this.userData$;
  }

  /// until here

  async getAllUsers(): Promise<User[]> {
    const usersCollection = collection(this.firestore, 'users');

    try {
      const snapshot = await getDocs(usersCollection);
      const users: User[] = [];
      snapshot.forEach((doc) => {
        const userData = doc.data() as User;
        users.push(userData);
      });
      this.usersSubject.next(users);
      return users;
    }
    catch (error) {
      console.error('Error loading all users:', error);
      throw error;
    }
  }

  async getUserByUid(uid: string): Promise<User | null> {
    const userDoc = doc(this.firestore, 'users', uid);
    try {
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data() as User;
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error loading user by uid:', error);
      throw error;
    }
  }

}
