export interface Items {
	[key: string]: [boolean, string, number];
}

export interface ComponentProps {
	data: Items;
	show: () => void;
}
