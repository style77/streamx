import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/User';

type ResponseData = {
    user: User;
};

interface UserContextType {
    user: User | null;
    register: (username: string, email: string, password1: string, password2: string) => Promise<ResponseData>;
    login: (email: string, password: string) => Promise<ResponseData>;
    logout: () => Promise<ResponseData>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const fetchCurrentUser = async () => {
        const response = await fetch("/api/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return
        }

        const responseData = await response.json();
        return responseData.data;
    }

    useEffect(() => {
        fetchCurrentUser().then(
            (data) => {
                setUser(data)
            }
        )
    }, []);

    const register = async (username: string, email: string, password1: string, password2: string) => {
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password1, password2 }),
            });

            const responseData = await response.json();

            if ("error" in responseData) {
                throw new Error(responseData.error);
            }

            setUser(responseData.user);
            return responseData;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const responseData = await response.json();

            if ("error" in responseData) {
                throw new Error(responseData.error);
            }

            setUser(responseData.user);
            return responseData;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const response = await fetch("/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const responseData = await response.json();

            if ("error" in responseData) {
                throw new Error(responseData.error);
            }

            setUser(null);
            return responseData;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return (
        <UserContext.Provider value={{ user, register, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}
