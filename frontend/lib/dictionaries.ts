// Define the shape of the dictionary
export interface Dictionary {
  common: {
    errors: {
      blogLoadError: string;
      tryAgainLater: string;
      notFound: string;
      generic: string;
    };
    cta: {
      title: string;
      subtitle: string;
      contactButton: string;
      resumeButton: string;
    };
  };
  blog: {
    metaTitle: string;
    metaDescription: string;
    heroImageAlt: string;
    latestArticles: string;
    viewAll: string;
    taggedWith: string;
    noPostsWithTag: string;
    noPostsAvailable: string;
    moreArticles: string;
    otherLanguageAvailable: string;
    readInLanguage: string;
    loadingPost: string;
  };
}

// English dictionary
const en: Dictionary = {
  common: {
    errors: {
      blogLoadError: 'Error Loading Blog',
      tryAgainLater: 'There was an error loading the blog posts. Please try again later.',
      notFound: 'Not Found',
      generic: 'Something went wrong. Please try again.',
    },
    cta: {
      title: 'Let\'s connect',
      subtitle: 'Open to connecting around thoughtful systems, internal tooling, or automation — especially where structure and clarity matter.',
      contactButton: 'Contact Me',
      resumeButton: 'Download Resume',
    },
  },
  blog: {
    metaTitle: 'System Logs – Dev Blog by Mirko Trotta',
    metaDescription: 'System Logs is the personal developer blog of Mirko Trotta, a full stack engineer based in Germany. Tutorials, case studies, and insights on backend systems, automation, and developer tools.',
    heroImageAlt: 'Blog Posts',
    latestArticles: 'Latest Articles',
    viewAll: 'View All Articles',
    taggedWith: 'Articles tagged with',
    noPostsWithTag: 'No posts found with tag',
    noPostsAvailable: 'No posts available right now.',
    moreArticles: 'More Articles',
    otherLanguageAvailable: 'This post is also available in another language.',
    readInLanguage: 'Read in English',
    loadingPost: 'Loading article...',
  },
};

// German dictionary
const de: Dictionary = {
  common: {
    errors: {
      blogLoadError: 'Fehler beim Laden des Blogs',
      tryAgainLater: 'Es gab einen Fehler beim Laden der Blogbeiträge. Bitte versuchen Sie es später noch einmal.',
      notFound: 'Nicht gefunden',
      generic: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    },
    cta: {
      title: 'Kontaktieren Sie mich',
      subtitle: 'Offen für Verbindungen rund um durchdachte Systeme, interne Tools oder Automatisierung — besonders, wo Struktur und Klarheit wichtig sind.',
      contactButton: 'Kontakt',
      resumeButton: 'Lebenslauf herunterladen',
    },
  },
  blog: {
    metaTitle: 'System Logs – Entwickler Blog von Mirko Trotta',
    metaDescription: 'System Logs ist der persönliche Entwicklerblog von Mirko Trotta, einem Full-Stack-Ingenieur aus Deutschland. Tutorials, Fallstudien und Einblicke in Backend-Systeme, Automatisierung und Entwicklertools.',
    heroImageAlt: 'Blog-Beiträge',
    latestArticles: 'Neueste Artikel',
    viewAll: 'Alle Artikel anzeigen',
    taggedWith: 'Artikel mit dem Tag',
    noPostsWithTag: 'Keine Beiträge mit dem Tag gefunden',
    noPostsAvailable: 'Zurzeit sind keine Beiträge verfügbar.',
    moreArticles: 'Weitere Artikel',
    otherLanguageAvailable: 'Dieser Beitrag ist auch in einer anderen Sprache verfügbar.',
    readInLanguage: 'Auf Deutsch lesen',
    loadingPost: 'Artikel wird geladen...',
  },
};

// Dictionary cache to avoid reloading the same dictionary multiple times
const dictionaries = {
  en,
  de,
};

export async function getDictionary(locale: string): Promise<Dictionary> {
  return locale === 'de' ? dictionaries.de : dictionaries.en;
} 