export interface Book {
  id: number;
  title: string;
  author: string;
  pages: Page[];
}

export interface Page {
  index: number;
  content: string;
}
