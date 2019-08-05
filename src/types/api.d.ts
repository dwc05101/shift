/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: OrganizationSignIn
// ====================================================

export interface OrganizationSignIn_OrganizationSignIn {
  __typename: "OrganizationSignInResponse";
  ok: boolean;
  error: string | null;
  token: string | null;
}

export interface OrganizationSignIn {
  OrganizationSignIn: OrganizationSignIn_OrganizationSignIn;
}

export interface OrganizationSignInVariables {
  loginId: string;
  password: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateOrganization
// ====================================================

export interface CreateOrganization_CreateOrganization {
  __typename: "CreateOrganizationResponse";
  ok: boolean;
  error: string | null;
  token: string | null;
}

export interface CreateOrganization {
  CreateOrganization: CreateOrganization_CreateOrganization;
}

export interface CreateOrganizationVariables {
  name: string;
  loginId: string;
  email: string;
  password: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
