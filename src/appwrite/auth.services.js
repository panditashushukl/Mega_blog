import config from "./../config/config";
import { Client, ID, Account } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create({
        email,
        password,
        name,
        userId: ID.unique(),
      });


      if (userAccount) {
        return this.login({ email, password });
      } else {
        console.warn("User account creation returned falsy value:", userAccount);
        return userAccount;
      }
    } catch (error) {
      console.error("Error in createAccount:", error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      const session = await this.account.createEmailPasswordSession({ email, password });
      return session;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const user = await this.account.get();
      return user;
    } catch (error) {
      console.warn("getCurrentUser(): not logged in or unauthorized", error);
      return null;
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.error("Error in logout:", error);
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
