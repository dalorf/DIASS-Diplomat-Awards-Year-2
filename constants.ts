


import type { Category } from './types.ts';

export const MAX_ATTEMPTS = 3;
export const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutes

export const CATEGORIES: Category[] = [
    { name: "Most Brilliant Diplomat", icon: "🎓", nominees: ["Ogunlade Pelumi", "Christian Ogala", "Daibu Fareedah", "Solomon Stephen", "Nicholas Mirabel"] },
    { name: "Most Handsome Diplomat", icon: "👔", nominees: ["Adebayo Julius", "Salimon Farouq", "Solomon Stephen", "Olanrewaju Bolu"] },
    { name: "Most Beautiful Diplomat", icon: "👗", nominees: ["Nwanedo Chidera", "Donatus Chidera", "Shobayo Simbi", "Nicholas Mirabel", "Seyi Gandonu"] },
    { name: "Most Reserved Diplomat (Male)", icon: "🤐", nominees: ["MOR", "Christian Ogala", "Biggie"] },
    { name: "Most Reserved Diplomat (Female)", icon: "🤫", nominees: ["Treasure Ebube", "Solomon Joy", "Temmy"] },
    { name: "Most Talented Diplomat", icon: "🎭", nominees: ["Ernest Henry", "Bolu Olanrewaju", "Ugochukwu Christsanctus", "Solomon Stephen"] },
    { name: "Most Creative Diplomat", icon: "🎨", nominees: ["Daibu Fareedah", "MOR", "Solomon Stephen", "Ernest Henry"] },
    { name: "Most Social Diplomat (Male)", icon: "🎉", nominees: ["Ernest Henry", "Ayo Salimon Farouq", "Ugo Christsanctus"] },
    { name: "Most Social Diplomat (Female)", icon: "💃", nominees: ["Debby Donatus", "Kowiat", "Abimbola"] },
    { name: "Most Entrepreneurial Diplomat", icon: "💼", nominees: ["Nicholas Mirabel", "Debby Donatus", "MOH", "Olakunle Kazeem"] },
    { name: "Most Popular Diplomat (Male)", icon: "⭐", nominees: ["Henry Ernest", "Ugochukwu Christsanctus", "Adebayo Julius"] },
    // FIX: Added missing colon after the 'name' property key.
    { name: "Most Popular Diplomat (Female)", icon: "✨", nominees: ["Ashley Favour", "Shobayo Simbi", "Gift"] },
    { name: "Favorite Diploma Lecturer", icon: "📚", nominees: ["Mr. Wilson", "Prof. Falode", "Mr. Femi"] },
    { name: "Most Expensive Diplomat (Male)", icon: "💎", nominees: ["Kazeem Olakunle", "Ayo Briefcase Guy"] },
    { name: "Most Expensive Diplomat (Female)", icon: "💍", nominees: ["Tess Nwanedo Chidera", "Chidera Donatus"] },
    { name: "Diploma Fashionista (Male)", icon: "🕴️", nominees: ["Henry Ernest", "Bolu Olanrewaju", "Christian Farouq", "Emmy Indebted"] },
    { name: "Diploma Fashionista (Female)", icon: "👠", nominees: ["Kowiat", "Tess", "Ifeoma", "Simbi"] },
    { name: "Most Outstanding Diplomat", icon: "🏆", nominees: ["Solomon Stephen", "Mr. Chris", "Ernest Henry", "Nicholas Mirabel", "Daibu Fareedah"] }
];