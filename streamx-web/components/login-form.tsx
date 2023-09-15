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
    email: z.string().email(),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})

export function LoginForm() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const { login } = useUser()

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setError("")
        try {
            setLoading(true);

            const responseData = await login(data.email, data.password) as unknown as {
                user: User;
                error?: string;
            }

            toast({
                title: `Hello back ${responseData.user.username}!`,
                description: (
                    <div>
                        Welcome again to <b>StreamX!</b>.
                    </div>
                ),
            });
            window.location.href = "/";
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data.error || 'An error occurred.');
            } else {
                setError(err.message ? err.message : 'An error occurred.');
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
                    name="password"
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
                <Button type="submit" disabled={loading}>{loading ? "Logging..." : "Login"}</Button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </Form>
    )
}