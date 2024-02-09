import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHomepageComponent } from './homepage/admin-homepage.component';
import { AdminAllShiftsComponent } from './shifts/admin-all-shifts.component';
import { AdminAllWorkersComponent } from './workers/admin-all-workers.component';
import { AdminWorkersUpdateComponent } from './edit-worker/admin-workers-update.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BestworkerComponent } from './best-worker/bestworker/bestworker.component';
import { PastshiftsComponent } from './shifts/past-shifts/pastshifts/pastshifts.component';



@NgModule({
  declarations: [
    AdminHomepageComponent,
    AdminAllShiftsComponent,
    AdminAllWorkersComponent,
    AdminWorkersUpdateComponent,
    BestworkerComponent,
    PastshiftsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        children: [
          {
            path: 'homepage',
            component: AdminHomepageComponent,
            },
          {
            path: 'shifts',
            component: AdminAllShiftsComponent,
            },
          {
            path: 'workers',
            component: AdminAllWorkersComponent,
            },
        ],
      },
    ]),
  ]
})
export class AdminModule { }
