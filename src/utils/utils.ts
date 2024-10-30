import jwt_decode from "jwt-decode";

export const getTrimmedText = (text: string, trimmedAt: number) => {
    if (!text) {
        return ""
    }
    if (text.length > trimmedAt) {
        return text.slice(0, trimmedAt) + " ..."
    }
    return text;
}

export const getTimesAgo = (timestamp: number) => {
    if (!timestamp) {
        return '';
    }
    const currentTimestamp = Date.now();
    const timeDifference = currentTimestamp - timestamp;

    if (timeDifference < 60000) {
        return "Just now";
    } else if (timeDifference < 3600000) {
        const minutes = Math.floor(timeDifference / 60000);
        return `${minutes}min ago`;
    } else if (timeDifference < 86400000) {
        const hours = Math.floor(timeDifference / 3600000);
        return `${hours}h ago`;
    } else if (timeDifference < 2592000000) { // 30 days
        const days = Math.floor(timeDifference / 86400000);
        return `${days}d ago`;
    } else if (timeDifference < 31536000000) { // 365 days
        const months = Math.floor(timeDifference / 2592000000);
        return `${months}m ago`;
    } else {
        const years = Math.floor(timeDifference / 31536000000);
        return `${years}y ago`;
    }
}

export const validateUserToken = (token: string | null) => {
    if (!token) {
        throw new Error("Invalid token found")
    }
    const decodedUser: any = jwt_decode(token);
    const userId = decodedUser["custom:user_id"];
    if (!userId) {
        throw new Error("Invalid token found")
    }
}

export const getLastSentence = (text: string): string => {
    if (!text) return ''
    const sentences = text.split('.');
    if (sentences.length > 0) {
        return sentences[sentences.length - 1];
    }
    return text;
}

export const getMinuteDifference = (timestamp: number): number => {
    if (!timestamp) {
        return 0;
    }
    const timeDifference =  Date.now() - timestamp;
    return Math.floor(timeDifference / 60000);
}

export const getSecondsDifference = (timestamp: number): number => {
    if (!timestamp) {
        return 0;
    }
    const timeDifference =  Date.now() - timestamp;
    return Math.floor(timeDifference / 1000);
}

export const getTimingInMinSec = (timestamp: number): string => {
    if (!timestamp) {
        return '00:00';
    }
    const ms = Date.now() - timestamp!
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export const calculateAverage = (dataArray: Uint8Array) => {
	const bufferLength = dataArray.byteLength;
	let sum = 0;
	for (let i = 0; i < bufferLength; i++) {
		sum += dataArray[i];
	}
	const average = sum / bufferLength;
	return average;
}

export const getFirstLetterUpperCase = (text: string) => {
    if (!text) {
        return '';
    }
    return text.charAt(0).toUpperCase();
}