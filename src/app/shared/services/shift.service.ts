import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Shift } from '../models/shift.model';
import { Firestore } from '@angular/fire/firestore';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  private shiftsSubject = new BehaviorSubject<Shift[]>([]);
  shifts$ = this.shiftsSubject.asObservable();

  private biggestAmountEarnedSubject = new BehaviorSubject<number>(0);
  biggestAmountEarned$ = this.biggestAmountEarnedSubject.asObservable();

  constructor(private firestore: Firestore) { }

  get shiftData() {
    return this.shifts$;
  }

  async getAllShifts() {
    const shiftsCollection = collection(this.firestore, 'shifts');
  
    try {
      const snapshot = await getDocs(shiftsCollection);
      const shifts: Shift[] = [];
  
      snapshot.forEach((doc) => {
        const shiftData = doc.data() as Shift;
        shiftData.isVisible = true;
        shifts.push(shiftData);
      });
  
      return shifts;
    } catch (error) {
      console.error('Error loading all shifts:', error);
      throw error;
    }
  }

  setShiftData(shiftData: any) {
    this.shiftsSubject.next(shiftData);
  }

  updateBiggestAmountEarned(amount: number) {
    this.biggestAmountEarnedSubject.next(amount);
  }
  
  async loadShifts(uid: string) {
    const shiftsCollection = collection(this.firestore, 'shifts');
    const shiftsQuery = query(shiftsCollection, where('uid', '==', uid));
  
    try {
      const snapshot = await getDocs(shiftsQuery);
      const shifts: Shift[] = [];
  
      snapshot.forEach((doc) => {
        const shiftData = doc.data() as Shift;
        shiftData.isVisible = true;
        shifts.push(shiftData);
      });
      this.setShiftData(shifts);
    } catch (error) {
      console.error('Error loading shifts:', error);
    }
  }

  async getShiftDetails(shiftId: string): Promise<Shift | undefined> {
    const shiftsCollection = collection(this.firestore, 'shifts');
    const shiftDoc = doc(shiftsCollection, shiftId);
  
    try {
      const docSnapshot = await getDoc(shiftDoc);
  
      if (docSnapshot.exists()) {
        const shiftData = docSnapshot.data() as Shift;
        return shiftData;
      } else {
        console.error('Shift not found');
        return undefined;
      }
    } catch (error) {
      console.error('Error getting shift details:', error);
      return undefined;
    }
  }

  addShift(uid: string, shift: Shift, shiftProfit: number) {
    const currentShifts = this.shiftsSubject.value;
    const randomShiftName = uuidv4();
    const isVisible = true;
    const shiftsCollection = collection(this.firestore, 'shifts');
    const shiftRef = doc(shiftsCollection, ...[randomShiftName]);
    const shiftWithUid = { ...shift, uid, shiftId: randomShiftName, shiftProfit, isVisible };

    setDoc(shiftRef, shiftWithUid)
      .then(() => {
        this.shiftsSubject.next([...currentShifts, { ...shiftWithUid }]);
      })
      .catch(error => {
        console.error('Error adding shift:', error);
      });
  }

  editShift(shiftId: string, updatedShiftData: Partial<Shift>, shiftProfit: number) {
    const shiftsCollection = collection(this.firestore, 'shifts');
    const shiftDoc = doc(shiftsCollection, shiftId);
  
    updateDoc(shiftDoc, { ...updatedShiftData, shiftProfit })
      .then(() => {
        const currentShifts = this.shiftsSubject.value;
        const updatedShifts = currentShifts.map(shift =>
          shift.shiftId === shiftId ? { ...shift, ...updatedShiftData, shiftProfit } : shift
        );
        this.shiftsSubject.next(updatedShifts);
      })
      .catch(error => {
        console.error('Error updating shift:', error);
      });
  }
  
  async deleteShift(shiftId: string): Promise<void> {
    const shiftsCollection = collection(this.firestore, 'shifts');
    const shiftDoc = doc(shiftsCollection, shiftId);
  
    try {
      await deleteDoc(shiftDoc);
      const currentShifts = this.shiftsSubject.value;
      const updatedShifts = currentShifts.filter(shift => shift.shiftId !== shiftId);
      this.shiftsSubject.next(updatedShifts);
    } catch (error) {
      console.error('Error deleting shift:', error);
      throw error; 
    }
  }

}
