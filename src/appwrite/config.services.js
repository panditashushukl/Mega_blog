import config from "./../config/config";
import { Client, ID, TablesDB, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  tablesDB;
  bucket;

  constructor() {

    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    this.tablesDB = new TablesDB(this.client);
    this.bucket = new Storage(this.client);

  }

  // 📝 Create a new post
  async createPost({ title, slug, content, featuredImage, status, userId }) {

    try {
      const result = await this.tablesDB.createRow({
        databaseId: config.appwriteDatabaseId,
        tableId: config.appwriteTableId,
        rowId: slug,
        data: { title, content, featuredImage, status, userId },
      });
      return result;
    } catch (error) {
      console.error("❌ Error creating post:", error.message);
      throw error;
    }
  }

  // 📝 Update an existing post
  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      const result = await this.tablesDB.updateRow(
        config.appwriteDatabaseId,
        config.appwriteTableId,
        slug,
        { title, content, featuredImage, status }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 🗑️ Delete a post
  async deletePost(slug) {
    console.group(`[deletePost] slug=${slug}`);
    try {
      await this.tablesDB.deleteRow(slug);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // 🔍 Get a specific post
  async getPost(slug) {
    console.group(`[getPost] slug=${slug}`);
    try {
      const result = await this.tablesDB.getRow({
        databaseId: config.appwriteDatabaseId,
        tableId: config.appwriteTableId,
        rowId: slug,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 📜 Get all posts
  async getPosts({
    status = "active",
    limit = 10,
    offset = 0,
    search = "",
    extraQueries = [],
  } = {}) {
    try {
      const queries = [
        Query.equal("status", status),
        Query.limit(limit),
        Query.offset(offset),
        ...extraQueries,
      ];
      const result = await this.tablesDB.listRows({
        databaseId: config.appwriteDatabaseId,
        tableId: config.appwriteTableId,
        queries,
        search,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 📤 Upload file
  async uploadFile(file) {
    try {
      const result = await this.bucket.createFile({
        bucketId: config.appwriteBucketId,
        fileId: ID.unique(),
        file,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 🗑️ Delete file
  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile({
        bucketId: config.appwriteBucketId,
        fileId,
      });
    } catch (error) {
      throw error;
    }
  }

  // 👁️ File preview
  getFilePreview(fileId) {
    try {
      const preview = this.bucket.getFilePreview({
        bucketId: config.appwriteBucketId,
        fileId,
      });
      return preview;
    } catch (error) {
      console.error("❌ Error getting preview:", error.message);
      throw error;
    }
  }
}

const service = new Service();

export default service;
