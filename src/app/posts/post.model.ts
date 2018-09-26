export interface Post {
    id: string;     // will be generated by mongoose automatically
    title: string;
    content: string;
    imagePath: string;
    creator: string;
}