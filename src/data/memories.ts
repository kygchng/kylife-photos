export type Memory = {
  id: string;
  title: string;
  location: string;
  date: string;
  coverImage: string;
  coverLandscape?: boolean;
  images: Array<{ src: string; landscape?: boolean }>;
};
