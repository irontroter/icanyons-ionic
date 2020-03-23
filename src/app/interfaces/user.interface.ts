export interface User {
    uid: string;
    email?: string | null;
    photoURL?: string;
    displayName?: string;
    bio?: string;
    location?: string;
    role: string;
    pro?: {
    contact: string,
    img: string,
    paypal: string,
    isActiveted: boolean
    };
    canyonsFav: [];
 }
