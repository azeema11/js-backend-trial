"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertUser = exports.deleteUser = exports.createUser = exports.findUserById = exports.findAllUsers = void 0;
const prisma_1 = require("../lib/prisma");
const findAllUsers = async () => {
    return await prisma_1.prisma.user.findMany();
};
exports.findAllUsers = findAllUsers;
const findUserById = async (id) => {
    return await prisma_1.prisma.user.findUnique({
        where: {
            id: id,
        },
    });
};
exports.findUserById = findUserById;
const createUser = async (userData) => {
    return await prisma_1.prisma.user.create({
        data: userData,
    });
};
exports.createUser = createUser;
const deleteUser = async (id) => {
    return await prisma_1.prisma.user.delete({
        where: {
            id: id,
        },
    });
};
exports.deleteUser = deleteUser;
const upsertUser = async (id, userData) => {
    return await prisma_1.prisma.user.upsert({
        where: { id: id },
        update: { name: userData.name, email: userData.email },
        create: { name: userData.name ?? "", email: userData.email ?? "" },
    });
};
exports.upsertUser = upsertUser;
