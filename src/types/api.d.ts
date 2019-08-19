/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateUserToOrganization
// ====================================================

export interface CreateUserToOrganization_CreateUserToOrganization {
  __typename: "CreateUserToOrganizationResponse"
  ok: boolean
  error: string | null
}

export interface CreateUserToOrganization {
  CreateUserToOrganization: CreateUserToOrganization_CreateUserToOrganization
}

export interface CreateUserToOrganizationVariables {
  personalCode: string
  name: string
  phoneNumber: string
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUser
// ====================================================

export interface UpdateUser_UpdateUser {
  __typename: "UpdateUserResponse"
  ok: boolean
  error: string | null
}

export interface UpdateUser {
  UpdateUser: UpdateUser_UpdateUser
}

export interface UpdateUserVariables {
  userId: number
  personalCode?: string | null
  userRank?: number | null
  name?: string | null
  phoneNumber?: string | null
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateSlot
// ====================================================

export interface CreateSlot_CreateSlot {
  __typename: "CreateSlotResponse"
  ok: boolean
  error: string | null
}

export interface CreateSlot {
  CreateSlot: CreateSlot_CreateSlot
}

export interface CreateSlotVariables {
  slots: (SlotInfo | null)[]
  timetableId: number
  organizationId: number
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCurrentTimeTable
// ====================================================

export interface GetCurrentTimeTable_GetCurrentTimeTable_timetable_organization_users {
  __typename: "User"
  name: string
  personalCode: string
}

export interface GetCurrentTimeTable_GetCurrentTimeTable_timetable_organization {
  __typename: "Organization"
  name: string
  users:
    | (GetCurrentTimeTable_GetCurrentTimeTable_timetable_organization_users | null)[]
    | null
}

export interface GetCurrentTimeTable_GetCurrentTimeTable_timetable_links {
  __typename: "Link"
  url: string
}

export interface GetCurrentTimeTable_GetCurrentTimeTable_timetable_days_slots_user {
  __typename: "User"
  name: string
  personalCode: string
}

export interface GetCurrentTimeTable_GetCurrentTimeTable_timetable_days_slots {
  __typename: "Slot"
  id: number
  isFulltime: boolean
  startTime: string
  endTime: string
  user: GetCurrentTimeTable_GetCurrentTimeTable_timetable_days_slots_user
}

export interface GetCurrentTimeTable_GetCurrentTimeTable_timetable_days {
  __typename: "Day"
  isEndTimeNextDay: boolean
  startTime: string
  endTime: string
  dayNumber: number
  slots:
    | (GetCurrentTimeTable_GetCurrentTimeTable_timetable_days_slots | null)[]
    | null
}

export interface GetCurrentTimeTable_GetCurrentTimeTable_timetable {
  __typename: "TimeTable"
  yearMonthWeek: string
  id: number
  isConfirmed: boolean
  organization: GetCurrentTimeTable_GetCurrentTimeTable_timetable_organization
  links:
    | (GetCurrentTimeTable_GetCurrentTimeTable_timetable_links | null)[]
    | null
  days: (GetCurrentTimeTable_GetCurrentTimeTable_timetable_days | null)[] | null
}

export interface GetCurrentTimeTable_GetCurrentTimeTable {
  __typename: "GetCurrentTimeTableResponse"
  ok: boolean
  error: string | null
  timetable: GetCurrentTimeTable_GetCurrentTimeTable_timetable | null
}

export interface GetCurrentTimeTable {
  GetCurrentTimeTable: GetCurrentTimeTable_GetCurrentTimeTable
}

export interface GetCurrentTimeTableVariables {
  yearMonthWeek?: string | null
  organizationId?: number | null
  timetableId?: number | null
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateLink
// ====================================================

export interface CreateLink_CreateLink_link {
  __typename: "Link"
  url: string
}

export interface CreateLink_CreateLink {
  __typename: "CreateLinkResponse"
  ok: boolean
  error: string | null
  link: CreateLink_CreateLink_link | null
}

export interface CreateLink {
  CreateLink: CreateLink_CreateLink
}

export interface CreateLinkVariables {
  timetableId: number
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUsers
// ====================================================

export interface GetUsers_GetUsers_users_slots_day_timetable {
  __typename: "TimeTable"
  id: number
  yearMonthWeek: string
}

export interface GetUsers_GetUsers_users_slots_day {
  __typename: "Day"
  timetable: GetUsers_GetUsers_users_slots_day_timetable
}

export interface GetUsers_GetUsers_users_slots {
  __typename: "Slot"
  id: number
  day: GetUsers_GetUsers_users_slots_day
}

export interface GetUsers_GetUsers_users {
  __typename: "User"
  id: number
  userRank: number
  personalCode: string
  name: string
  phoneNumber: string
  organizationId: number | null
  slots: (GetUsers_GetUsers_users_slots | null)[] | null
}

export interface GetUsers_GetUsers {
  __typename: "GetUsersResponse"
  ok: boolean
  error: string | null
  users: (GetUsers_GetUsers_users | null)[] | null
}

export interface GetUsers {
  GetUsers: GetUsers_GetUsers
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationProfile
// ====================================================

export interface GetOrganizationProfile_GetOrganizationProfile_organization_users {
  __typename: "User"
  id: number
}

export interface GetOrganizationProfile_GetOrganizationProfile_organization {
  __typename: "Organization"
  name: string
  email: string
  users:
    | (GetOrganizationProfile_GetOrganizationProfile_organization_users | null)[]
    | null
}

export interface GetOrganizationProfile_GetOrganizationProfile {
  __typename: "GetOrganizationProfileResponse"
  ok: boolean
  error: string | null
  organization: GetOrganizationProfile_GetOrganizationProfile_organization | null
}

export interface GetOrganizationProfile {
  GetOrganizationProfile: GetOrganizationProfile_GetOrganizationProfile
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AuthenticateUser
// ====================================================

export interface AuthenticateUser_AuthenticateUser_user_slots_day {
  __typename: "Day"
  dayNumber: number
}

export interface AuthenticateUser_AuthenticateUser_user_slots {
  __typename: "Slot"
  isFulltime: boolean
  startTime: string
  isEndTimeNextDay: boolean
  isStartTimeNextDay: boolean
  endTime: string
  day: AuthenticateUser_AuthenticateUser_user_slots_day
}

export interface AuthenticateUser_AuthenticateUser_user {
  __typename: "User"
  slots: (AuthenticateUser_AuthenticateUser_user_slots | null)[] | null
}

export interface AuthenticateUser_AuthenticateUser {
  __typename: "AuthenticateUserResponse"
  ok: boolean
  error: string | null
  user: AuthenticateUser_AuthenticateUser_user | null
}

export interface AuthenticateUser {
  AuthenticateUser: AuthenticateUser_AuthenticateUser
}

export interface AuthenticateUserVariables {
  personalCode: string
  organizationId: number
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: OrganizationSignIn
// ====================================================

export interface OrganizationSignIn_OrganizationSignIn {
  __typename: "OrganizationSignInResponse"
  ok: boolean
  error: string | null
  token: string | null
}

export interface OrganizationSignIn {
  OrganizationSignIn: OrganizationSignIn_OrganizationSignIn
}

export interface OrganizationSignInVariables {
  loginId: string
  password: string
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTimeTable
// ====================================================

export interface CreateTimeTable_CreateTimeTable {
  __typename: "CreateTimeTableResponse"
  ok: boolean
  error: string | null
  timetableId: number | null
}

export interface CreateTimeTable {
  CreateTimeTable: CreateTimeTable_CreateTimeTable
}

export interface CreateTimeTableVariables {
  yearMonthWeek: string
  days: (TimeTableDay | null)[]
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateOrganization
// ====================================================

export interface UpdateOrganization_UpdateOrganization {
  __typename: "UpdateOrganizationResponse"
  ok: boolean
  error: string | null
}

export interface UpdateOrganization {
  UpdateOrganization: UpdateOrganization_UpdateOrganization
}

export interface UpdateOrganizationVariables {
  name: string
  password: string
  email: string
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateOrganization
// ====================================================

export interface CreateOrganization_CreateOrganization {
  __typename: "CreateOrganizationResponse"
  ok: boolean
  error: string | null
  token: string | null
}

export interface CreateOrganization {
  CreateOrganization: CreateOrganization_CreateOrganization
}

export interface CreateOrganizationVariables {
  name: string
  loginId: string
  email: string
  password: string
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveUserFromOrganization
// ====================================================

export interface RemoveUserFromOrganization_RemoveUserFromOrganization {
  __typename: "RemoveUserFromOrganizationResponse"
  ok: boolean
  error: string | null
}

export interface RemoveUserFromOrganization {
  RemoveUserFromOrganization: RemoveUserFromOrganization_RemoveUserFromOrganization
}

export interface RemoveUserFromOrganizationVariables {
  users: (number | null)[]
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTimeTables
// ====================================================

export interface GetTimeTables_GetTimeTables_timetables_days_slots_user {
  __typename: "User"
  name: string
  personalCode: string
}

export interface GetTimeTables_GetTimeTables_timetables_days_slots {
  __typename: "Slot"
  startTime: string
  endTime: string
  user: GetTimeTables_GetTimeTables_timetables_days_slots_user
}

export interface GetTimeTables_GetTimeTables_timetables_days {
  __typename: "Day"
  dayNumber: number
  startTime: string
  endTime: string
  slots: (GetTimeTables_GetTimeTables_timetables_days_slots | null)[] | null
}

export interface GetTimeTables_GetTimeTables_timetables {
  __typename: "TimeTable"
  id: number
  isConfirmed: boolean
  yearMonthWeek: string
  createdAt: string
  updatedAt: string | null
  days: (GetTimeTables_GetTimeTables_timetables_days | null)[] | null
}

export interface GetTimeTables_GetTimeTables {
  __typename: "GetTimeTablesResponse"
  ok: boolean
  error: string | null
  timetables: (GetTimeTables_GetTimeTables_timetables | null)[] | null
}

export interface GetTimeTables {
  GetTimeTables: GetTimeTables_GetTimeTables
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface SlotInfo {
  personalCode: string
  isSelected: boolean
  isFulltime: boolean
  dayNumber: number
  startTime: string
  endTime: string
  isEndTimeNextDay: boolean
  isStartTimeNextDay: boolean
}

export interface TimeTableDay {
  dayNumber: number
  startTime: string
  endTime: string
  isEndTimeNextDay: boolean
}

//==============================================================
// END Enums and Input Objects
//==============================================================
