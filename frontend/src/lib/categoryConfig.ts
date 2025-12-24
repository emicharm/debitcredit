import type { Icon } from "lucide-svelte";
import { Wallet, Smartphone, Send, ArrowLeftRight, Car, RotateCcw, Undo2, Pill, HandCoins, Gamepad2, User, Sparkles, Gift, Tablet, GraduationCap, Home, Armchair, Shirt, Film } from "lucide-svelte";

export const categoryConfig: {[key: string]: {color: string, icon: typeof Icon}} = {
    "Salary": {color: "bg-yellow-500", icon: Wallet},
    "Mobile": {color: "bg-purple-500", icon: Smartphone},
    "Переводы": {color: "bg-blue-500", icon: Send},
    "Exchange": {color: "bg-green-500", icon: ArrowLeftRight},
    "Taxi": {color: "bg-orange-500", icon: Car},
    "Refund": {color: "bg-teal-500", icon: RotateCcw},
    "Reversing entry": {color: "bg-indigo-500", icon: Undo2},
    "Pharmacy": {color: "bg-red-500", icon: Pill},
    "Lend": {color: "bg-cyan-500", icon: HandCoins},
    "Games": {color: "bg-pink-500", icon: Gamepad2},
    "Mental Health": {color: "bg-violet-500", icon: User},
    "Beauty": {color: "bg-rose-500", icon: Sparkles},
    "Gift": {color: "bg-fuchsia-500", icon: Gift},
    "Electronics": {color: "bg-slate-500", icon: Tablet},
    "Education": {color: "bg-sky-500", icon: GraduationCap},
    "Rent": {color: "bg-amber-500", icon: Home},
    "Furniture": {color: "bg-lime-500", icon: Armchair},
    "Clothing": {color: "bg-emerald-500", icon: Shirt},
    "Entertainment": {color: "bg-red-600", icon: Film},
};
