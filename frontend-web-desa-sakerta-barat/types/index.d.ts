declare type User = {
  id: string;
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  name: string;
  // address1: string;
  // city: string;
  // state: string;
  // postalCode: string;
  // dateOfBirth: string;
  // ssn: string;
};

declare interface ExploreProps {
    title: string;
    description: string;
  }

declare interface SiderbarProps {
  user: User;
}

declare interface LoginProps {
  username: string;
  password: string;
}

// ========================================

declare type RegisterParams = {
  firstName: string;
  lastName: string;
  username: string;
  name: string;
  email: string;
  password: string;
};