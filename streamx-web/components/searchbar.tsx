"use client"
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { getUserAvatar } from "@/lib/utils";
import Link from "next/link";

export function SearchBar() {
    const [search, setSearch] = useState<string>("");
    const [data, setData] = useState<string[]>([]);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);

    const handleSearch = async () => {
        if (search.length === 0) {
            setData([]);
            return;
        }

        const res = await fetch(`/api/search?q=${search}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = (await res.json()).data.results;
        const filteredData = data.map((user: any) => {
            return {
                username: user.username,
            };
        });

        setData(filteredData);
    };

    useEffect(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        const timeout = setTimeout(() => {
            handleSearch();
        }, 250);

        setTimeoutId(timeout as any);
    }, [search]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);

        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };

    return (
        <div className="flex flex-row items-center">
            <div className="flex flex-col">
                <div className="flex flex-row">
                    <Input
                        placeholder="Search"
                        className="rounded-r-none focus:border-white focus-visible:ring-0 transition"
                        onChange={handleInputChange}
                        value={search}
                    />
                    <button
                        className={`p-2 bg-gray-800 rounded-r-lg hover:bg-gray-600 transition ${
                            search.length === 0 ? "cursor-not-allowed" : "cursor-pointer"
                        }`}
                    >
                        <Search />
                    </button>
                </div>
                {data.length > 0 && (
                    <div className="absolute mt-10 bg-gray-900 w-64 rounded-sm">
                        <div className="my-2">
                            <ul className="space-y-1">
                                {data.map((result: any, index: number) => (
                                    <Link href={`/@${result.username}`} key={index} onClick={() => setSearch("")}>
                                        <li key={index} className="flex flex-row gap-2 items-center cursor-pointer hover:bg-gray-800 px-2 py-1">
                                            <Image src={getUserAvatar(result.username)} alt="User avatar" width={32} height={32} className="rounded-full" />
                                            {result.username}
                                        </li>
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}