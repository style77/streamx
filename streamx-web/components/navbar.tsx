import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { SearchBar } from "./searchbar"
import { useUser } from "@/context/user.context"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"
import { getRelativeTime, getUserAvatar } from "@/lib/utils"

export function Navbar() {
  const { user, logout } = useUser()

  return (
    <nav className="sticky flex gap-6 md:gap-10 p-4 justify-between z-50">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
      <SearchBar />
      <div className="flex flex-row gap-2 text-sm">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex flex-col justify-center items-center gap-1 pr-4 cursor-pointer">
                <Image src={getUserAvatar(user.username)} alt="User avatar" width={32} height={32} className="rounded-full" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 mr-4">
              <DropdownMenuLabel className="py-0 pt-1.5">{user.username}</DropdownMenuLabel>
              <p className="ml-2 text-[10px] text-gray-500">Last Login: {getRelativeTime(user.last_login)}</p>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={
                  async () => await logout()
                }>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/login">
              <button className="text-gray-100 hover:text-white font-bold py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-sm">Login</button>
            </Link>
            <Link href="/register">
              <button className="text-gray-100 hover:text-white font-bold py-2 px-4 bg-violet-800 hover:bg-violet-700 rounded-sm">Sign up</button>
            </Link>
          </>
        )
        }
      </div >
    </nav >
  )
}
