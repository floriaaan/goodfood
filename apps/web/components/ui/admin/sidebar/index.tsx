"use client";
import Link from "next/link";
import { Logo } from "@/components/ui/icon/logo";
import { Select } from "@/components/ui/select";
import { MdChecklist, MdCurrencyBitcoin, MdDoneAll, MdKeyboardBackspace, MdTableView } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export const Sidebar = () => {
  const [displayMode, setDisplayMode] = useState("Default");
  return (
    <div className="flex h-screen flex-col items-center px-6 py-3">
      <div className="mb-10">
        <Link id="nav-logo" data-testid="nav-logo" className="mx-6 h-auto" href={"/"}>
          <Logo className="h-10 w-fit" />
        </Link>
        <Link href="/" className="flex items-center justify-center gap-x-1  text-sm font-semibold text-gray-600">
          <MdKeyboardBackspace /> Retour au catalogue
        </Link>
      </div>
      <Select aria-label="Restaurant séléctionné" />
      <div className="my-10 flex flex-col gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-x-2 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5"
        >
          <MdTableView className="h-5 w-5 shrink-0" /> Visualisation des données
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-x-2 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5"
        >
          <MdCurrencyBitcoin className="h-5 w-5 shrink-0" /> Statistiques et revenus
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-x-2 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5"
        >
          <MdChecklist className="h-5 w-5 shrink-0" />
          Gestion des stocks
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-x-2 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5"
        >
          <MdDoneAll className="h-5 w-5 shrink-0" />
          État de l’application
        </Link>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>{displayMode}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={(e) => {
                setDisplayMode(e.target!.firstChild.data);
              }}
            >
              Mode 1
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                setDisplayMode(e.target!.firstChild.data);
              }}
            >
              Mode 2
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                setDisplayMode(e.target!.firstChild.data);
              }}
            >
              Mode 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
