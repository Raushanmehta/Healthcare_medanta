"use server";

import { ID, Query } from "node-appwrite";
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

// Utility function to convert Blob to Buffer
const blobToBuffer = async (blob: Blob): Promise<Buffer> => {
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
};

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(),
            user.email,
            undefined, // Password is optional in Appwrite
            user.phone,
            user.name
        );
        console.log({ newUser });

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

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);
        return parseStringify(user);
    } catch (error) {
        console.error("An error occurred while getting the user:", error);
        throw new Error("Failed to get user");
    }
};

export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
    try {
        let file;
        if (identificationDocument) {
            const buffer = await blobToBuffer(identificationDocument.blobFile);
            const inputFile = InputFile.fromBuffer(buffer, identificationDocument.fileName);
            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
        }
        console.log({gender: patient.gender})

        const newPatient = await database.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl:`${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...patient
                
            }
        );
        return parseStringify(newPatient);
    } catch (error) {
        console.error("An error occurred while registering the patient:", error);
        throw new Error("Failed to register patient");
    }
};
