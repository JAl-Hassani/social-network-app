"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// write the authenticated user's data to the database
export async function syncUser() {
    try {
        const {userId} = await auth();
        const user = await currentUser();

        if (!userId || !user) return;

        // if user already exists, return that existing user
        const existingUser = await prisma.user.findUnique({
            where: {
                clerkId: userId
            }
        })

        if (existingUser) {
            return existingUser;
        }
        
        const dbUser = await prisma.user.create({
            data: {
                clerkId: userId,
                name: `${user.firstName || ""} ${user.lastName || ""}`,
                username: user.username ?? user.emailAddresses[0].emailAddress.split('@')[0],
                email: user.emailAddresses[0].emailAddress,
                image: user.imageUrl,
            }
        })

        return dbUser;

    } catch (error) {
        console.log("Error in syncUser", error);
    }
}

// get the user's data
export async function getUserByClerkId(clerkId:string) {
    return prisma.user.findUnique({
        where: {
            clerkId,
        },
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                    posts: true
                }
            }
        }
    })
}

// get the user's id
export async function getDbUserId() {
    const { userId:clerkId } = await auth();

    if (!clerkId) throw new Error("Unauthenticated user");

    const user = await getUserByClerkId(clerkId);

    if (!user) throw new Error("User not found");

    return user.id;
}

// select 3 users at random as suggestion of who to follow
// do not include the current user or those that the current
// user already follows
export async function getRandomUsers() {
    try {
        const userId = await getDbUserId();

        const randomUsers = await prisma.user.findMany({
            where: {
                AND: [
                    {NOT: {id: userId}},
                    {
                        NOT: {
                            followers: {
                                some: {
                                    followerId: userId
                                }
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
                _count: {
                    select: {
                        followers: true,
                    },
                },
            },
            take: 3
        });

        return randomUsers;

    } catch (error) {
        console.log("Error fetching random users", error);
        return [];
    }
}

export async function toggleFollow(targetUserId:string) {
    try {
        const userId = await getDbUserId();

        if (userId === targetUserId) throw new Error("A user cannot follow themselves");

        const existingFollow = await prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId: targetUserId
                }
            }
        })

        if (existingFollow) {
            // unfollow
            await prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: userId,
                        followingId: targetUserId
                    }
                }
            });
        } else {
            // follow and create notification
            await prisma.$transaction([
                prisma.follows.create({
                    data: {
                        followerId: userId,
                        followingId: targetUserId
                    }
                }),
                prisma.notification.create({
                    data: {
                        userId: targetUserId,
                        creatorId: userId,
                        type: "FOLLOW"
                    }
                })
            ]);
        }

        revalidatePath("/");
        return {success:true};
    } catch (error) {
        console.log("Error in toggleFollow", error);
        return {success:false, error:"Error in toggleFollow"};
    }
}