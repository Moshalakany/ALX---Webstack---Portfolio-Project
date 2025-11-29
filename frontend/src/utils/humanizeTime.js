import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';

export const humanizeTime = (timestamp) => {
	if (!timestamp) return "Never";
	
	const date = new Date(timestamp);
	
	if (isToday(date)) {
		return `Today at ${format(date, 'h:mm a')}`;
	}
	
	if (isYesterday(date)) {
		return `Yesterday at ${format(date, 'h:mm a')}`;
	}
	
	// For dates within the last week
	const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
	if (daysAgo < 7) {
		return `${formatDistanceToNow(date, { addSuffix: true })}`;
	}
	
	// For older dates
	return format(date, 'MMM d, yyyy');
};
