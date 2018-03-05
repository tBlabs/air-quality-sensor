// import { byte } from "../../types/byte";

// // export class ParserOutput<T extends new()=>object>
// // {
// //     private type: T;
// //     private t: new()=>object;

// //     public get Obj(): T
// //     {
// //         return this.type;
// //     }

// //     constructor(t: T)
// //     {
// //         this.t = new t();
// //        // Object.assign(this.t, {});
// //     }

// //     public Store(key: keyof T, value: byte): void
// //     {
// //         // this.type[key as string] = value;
// //         this.t[key as string] = value;
// //     }

// //     public Reset(): void
// //     {
// //         // this.type = {};
// //         Object.assign(this.type, {});
// //     }
// // }

// export class ParserOutput<T>
// {
//     private type: T;

//     constructor(t: T)
//     {
//         this.type = t;
//     }

//     public get Obj(): T
//     {
//         return this.type;
//     }

//     public Store(key: keyof T, value: byte): void
//     {
//         this.type[key as string] = value;
//     }

//     public Reset(): void
//     {
//         // this.type = new t();
//         Object.assign(this.type, {});
        
//     }
// }
