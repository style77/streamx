"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"

import axios, { Axios, AxiosError } from "axios"
import { useUser } from "@/context/user.context"
import { User } from "@/types/User"

const FormSchema = z.object({
    username: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }).regex(/^[_.+\-a-zA-Z0-9]+$/, {
        message: "Username must can only include letters, numbers, and _-+, can't use spaces",
    }),
    email: z.string().email(),
    password1: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    password2: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    })
}).refine(
    (data) => data.password1 === data.password2,
    { message: "Passwords must match.", path: ["password2"] },
)

export function RegisterForm() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const { register } = useUser()

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setError("")
        try {
            setLoading(true);

            const response = await register(data.username, data.email, data.password1, data.password2) as unknown as {
                data: {
                    user: User;
                    error?: string;
                }
            }
            const responseData = response.data;

            toast({
                title: `Hello ${responseData.user.username}!`,
                description: (
                    <div>
                        Welcome to <b>StreamX!</b> Start by browsing current streams or
                        creating your own and entertaining the world!
                    </div>
                ),
            });
            window.location.href = "/";
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data.error || 'An error occurred.');
            } else {
                setError('An error occurred. ' + err);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="mail@mail.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="style77" {...field} className="lowercase" />
                            </FormControl>
                            <FormDescription>
                                This is your public display name. You won&apos;t be able to
                                change this later. Remember, your username is your brand, keep it short and sweet!
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password1"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="••••••••" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password2"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input placeholder="••••••••" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</Button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </Form>
    )
}