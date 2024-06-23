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