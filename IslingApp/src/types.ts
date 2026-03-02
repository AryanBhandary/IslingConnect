export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Register: undefined;
  AuthLoading: undefined;
  MainTabs: undefined;
  LostFound: undefined;
  ReportItem: { type: "lost" | "found" };
  ItemDetail: { item: any };
  MyReports: undefined;
  Chat: { chatId: string; item: any; otherUser: any };
  ChatList: undefined;
  BookAppointment: { department: "PAT" | "IT" };
};

export type MainTabParamList = {
  Home: undefined;
  Notifications: undefined;
  Activity: undefined;
  Profile: undefined;
};
