"use server";

import { ID, Query, } from "node-appwrite";
import { BUCKET_ID, DATABASE_ID, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users, database } from "../appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";



interface CreateUserParams {
    email: string;
    phone: string;
    name: string;
}

interface RegisterUserParams extends CreateUserParams {
    gender: string;
    identificationDocument?: {
        blobFile: Blob;
        fileName: string;
        
    };
}
const blobToBuffer = async (blob: Blob): Promise<Buffer> => {
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
};



export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(),
            user.email,
            undefined, 
            user.phone,
            user.name
        );
        return parseStringify(newUser);
    } catch (error: any) {
        if (error && error.code === 409) {
            const existingUser = await users.list([
                Query.equal('email', user.email),
            ]);
            return existingUser.users[0];
        }
        console.error("An error occurred while creating a new user:", error);
        throw new Error("Failed to create user");
    }
};
// GET USER
export const getUser = async (userId: string) => {
    try {
      const user = await users.get(userId);
  
      return parseStringify(user);
    } catch (error) {
      console.error(
        "An error occurred while retrieving the user details:",
        error
      );
    }
  };
  
// REGISTER PATIENT
export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
    try {
        let file;
        if (identificationDocument) {
            const buffer = await blobToBuffer(identificationDocument.blobFile);
            const inputFile = InputFile.fromBuffer(buffer, identificationDocument.fileName);
            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
        }

        const newPatient = await database.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: file ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}` : null,
                ...patient
            }
        );

        return parseStringify(newPatient);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack trace:", error.stack);
        } else {
            console.error("Unknown error:", error);
        }
        throw new Error("Failed to register patient");
    }
};

//GET PATIENT
export const getPatient = async (userId: string) => {
    try {
      const patients = await database.listDocuments(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        [Query.equal("userId", [userId])]
      );
  
      return parseStringify(patients.documents[0]);
    } catch (error) {
      console.error(
        "An error occurred while retrieving the patient details:",
        error
      );
    }
  };
