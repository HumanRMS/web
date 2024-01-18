import { LoginLayoutComponent } from '../layout/login/login.component';
import { MainLayoutComponent } from '../layout/main/main.component';

export const routes = [
  {
    path: '',
    component: LoginLayoutComponent,
    loadChildren: () => import('./account/account.module').then((m) => m.AccountModule),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path:'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule) },
      { path:'employees', loadChildren: () => import('./employees/employees.module').then((m) => m.EmployeesModule) },
      { path:'organization', loadChildren: () => import('./organization/organization.module').then((m) => m.organizationModule) },
      { path:'leave-planner', loadChildren: () => import('./leave-planner/leave-planner.module').then((m) => m.LeavePlannerModule) },
      { path:'notifications', loadChildren: () => import('./notifications/notifications.module').then((m) => m.NotificationsModule) },
      { path:'dailyPunching', loadChildren: () => import('./daily-punching/daily-punching.module').then((m) => m.DailyPunchingModule) },
      { path:'projects', loadChildren: () => import('./projects/projects.module').then((m) => m.ProjectsModule)}
    ],
  },
];
