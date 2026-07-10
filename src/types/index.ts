export interface NavLink {
  label: string;
  href: string;
}

export interface Pillar {
  title: string;
  body: string;
  image: string;
}

export interface Solution {
  title: string;
  body: string;
  image: string;
}

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
}

export interface StoryMilestone {
  title: string;
  body: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}
