import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Define constants for the legal directory paths
const BASE_LEGAL_DIR = path.join(process.cwd(), "content/legal");
const LEGAL_DIR = {
  en: path.join(BASE_LEGAL_DIR, "en"),
  de: path.join(BASE_LEGAL_DIR, "de")
};

// Default language to fall back to
const DEFAULT_LANGUAGE = 'en';

export interface LegalFrontmatter {
  title: string;
  lastUpdated: string;
}

export interface LegalData {
  slug: string;
  frontmatter: LegalFrontmatter;
  content: string;
  htmlContent: string;
  language: string;
}

/**
 * Convert markdown content to HTML with better formatting
 */
function markdownToHtml(markdown: string): string {
  // First, normalize line endings and trim
  let html = markdown.replace(/\r\n/g, '\n').trim();
  
  // Process block-level elements first
  html = html
    // Headers (process from h3 to h1 to avoid conflicts)
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mb-4 mt-8 text-gray-900 dark:text-white">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-6 mt-10 text-gray-900 dark:text-white">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">$1</h1>')
    
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="my-8 border-gray-300 dark:border-gray-700" />');
  
  // Process inline elements
  html = html
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
    
    // Links - handle [text](url) format
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline transition-colors">$1</a>');
  
  // Process lists
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Check if this line is a list item
    if (trimmedLine.match(/^- (.+)/)) {
      if (!inList) {
        processedLines.push('<ul class="list-disc list-inside space-y-2 mb-6 ml-4">');
        inList = true;
      }
      const listContent = trimmedLine.replace(/^- (.+)/, '$1');
      processedLines.push(`<li class="text-gray-700 dark:text-gray-300">${listContent}</li>`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(line);
    }
  }
  
  // Close any open list
  if (inList) {
    processedLines.push('</ul>');
  }
  
  html = processedLines.join('\n');
  
  // Process paragraphs - split by double newlines
  const paragraphs = html.split(/\n\s*\n/);
  const processedParagraphs = paragraphs.map(paragraph => {
    paragraph = paragraph.trim();
    if (!paragraph) return '';
    
    // Skip if already wrapped in HTML block tags
    if (paragraph.match(/^<(h[1-6]|hr|ul|div)/)) {
      return paragraph;
    }
    
    // Check if it's just a single line that might be part of a structure
    if (!paragraph.includes('\n') && paragraph.length < 200) {
      return `<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">${paragraph}</p>`;
    }
    
    // For multi-line content, split by single newlines and wrap each as a paragraph
    const lines = paragraph.split('\n').filter(line => line.trim());
    return lines
      .map(line => line.trim())
      .filter(line => line && !line.match(/^<(h[1-6]|hr|ul|div)/))
      .map(line => `<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">${line}</p>`)
      .join('\n');
  });
  
  return processedParagraphs
    .filter(p => p)
    .join('\n\n')
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive newlines
    .trim();
}

// Embedded legal content for production builds
const EMBEDDED_LEGAL_CONTENT = {
  en: {
    privacy: {
      frontmatter: {
        title: "Privacy Policy",
        lastUpdated: "2025-07-27"
      },
      content: `# Privacy Policy

**Last Updated:** July 27, 2025

This Privacy Policy explains how Mirko Trotta ("I," "me," or "my") collects, uses, and protects your personal information when you visit my website [https://mirkotrotta.com] (the "Site"). It also applies to my future business site [https://metacubostudio.com].

## 1. Data Controller

**Mirko Trotta**  
Lehrhöfer Straße 22  
63457 Hanau, Germany  
Email: hello@mirkotrotta.com  
Phone: +49 01739405570  

Registered as a freelancer (Freiberufler) in Germany.

## 2. Personal Data We Collect

### 2.1 Information You Provide to Us
- **Contact Form** (via Formspree): Name, email address, subject, and message content.
- **Newsletter Subscription** (via Buttondown): Email address and language preference.
- **Technical Support**: Any information you provide when contacting us.

### 2.2 Information Automatically Collected
- **Analytics Data**: IP address (possibly anonymized), browser type, device info, pages visited, time on site, referring websites.
- **Cookies**: Cookies for site functionality, analytics, marketing preferences.
- **Log Files**: Server logs with IP addresses, browser info, access times.
- **Embedded Content**: YouTube videos, social media embeds (LinkedIn, X/Twitter), potential AI chat interfaces.

## 3. Legal Basis for Processing

We process your personal data based on:
- **Consent**: For analytics cookies, marketing cookies, newsletter subscriptions.
- **Legitimate Interest**: For essential site functionality, security, contact form replies.
- **Contractual Necessity**: To respond to your inquiries and deliver requested services.

## 4. How We Use Your Data

### 4.1 Contact Form Data
- Respond to your inquiries.
- Provide customer support.
- Maintain business records.

### 4.2 Newsletter Data
- Send updates about new content or services.
- Provide information about projects.
- Analyze engagement.

### 4.3 Analytics and Tracking Data
- Understand website usage.
- Improve performance and UX.
- Prepare usage statistics.
- Support potential advertising/marketing (e.g., Google AdSense in the future).

## 5. Cookies and Tracking Technologies

We use the following types of cookies:

### 5.1 Necessary Cookies
- **Purpose**: Enable essential site features.
- **Legal Basis**: Legitimate interest.
- **Expiration**: Session or up to 1 year.
- **Cannot be disabled**.

### 5.2 Analytics Cookies
- **Purpose**: Analyze site usage, improve services.
- **Legal Basis**: Consent.
- **Expiration**: Up to 26 months.
- **Can be disabled**: Via cookie preferences.

### 5.3 Marketing Cookies
- **Purpose**: Measure marketing effectiveness, deliver personalized content or ads.
- **Legal Basis**: Consent.
- **Expiration**: Up to 2 years.
- **Can be disabled**: Via cookie preferences.

Your consent will be managed through our custom GDPR-compliant cookie banner. Non-essential cookies will only be set after consent.

## 6. Third-Party Services

### 6.1 Analytics Services
- **Google Analytics 4** (with potential IP anonymization): [https://policies.google.com/privacy]
- Other privacy-friendly or self-hosted options (e.g., Umami) may be added in the future.

### 6.2 Other Services
- **Hosting Provider**: Hetzner Online GmbH, Germany.
- **Email Processing**: Formspree for contact forms, Buttondown for newsletters.
- **Embedded Content Providers**: YouTube, social media (LinkedIn, X/Twitter), potential AI chatbot providers.

## 7. Data Retention

- **Contact Form Data**: Up to 2 years from last contact.
- **Newsletter Subscriptions**: Until unsubscribed.
- **Analytics Data**: Up to 26 months.
- **Cookie Data**: Per cookie settings and preferences.`
    },
    terms: {
      frontmatter: {
        title: "Terms of Service",
        lastUpdated: "2025-07-27"
      },
      content: `# Terms of Service

**Last Updated:** July 27, 2025

These Terms of Service ("Terms") govern your use of the website [https://mirkotrotta.com] (the "Site") operated by Mirko Trotta ("I," "me," or "my").

## 1. Acceptance of Terms

By accessing and using this Site, you accept and agree to be bound by the terms and provision of this agreement.

## 2. Use License

Permission is granted to temporarily download one copy of the materials (information or software) on Mirko Trotta's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:

- modify or copy the materials;
- use the materials for any commercial purpose or for any public display (commercial or non-commercial);
- attempt to decompile or reverse engineer any software contained on Mirko Trotta's website;
- remove any copyright or other proprietary notations from the materials; or
- transfer the materials to another person or "mirror" the materials on any other server.

This license shall automatically terminate if you violate any of these restrictions and may be terminated by Mirko Trotta at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.

## 3. Disclaimer

The materials on Mirko Trotta's website are provided on an 'as is' basis. Mirko Trotta makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

## 4. Limitations

In no event shall Mirko Trotta or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Mirko Trotta's website, even if Mirko Trotta or a Mirko Trotta authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.

## 5. Accuracy of Materials

The materials appearing on Mirko Trotta's website could include technical, typographical, or photographic errors. Mirko Trotta does not warrant that any of the materials on its website are accurate, complete or current. Mirko Trotta may make changes to the materials contained on its website at any time without notice. However Mirko Trotta does not make any commitment to update the materials.

## 6. Links

Mirko Trotta has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Mirko Trotta of the site. Use of any such linked website is at the user's own risk.

## 7. Modifications

Mirko Trotta may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.

## 8. Governing Law

These terms and conditions are governed by and construed in accordance with the laws of Germany and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.`
    },
    impressum: {
      frontmatter: {
        title: "Legal Notice",
        lastUpdated: "2025-07-27"
      },
      content: `# Legal Notice

**Last Updated:** July 27, 2025

## Contact Information

**Mirko Trotta**  
Lehrhöfer Straße 22  
63457 Hanau, Germany  
Email: hello@mirkotrotta.com  
Phone: +49 01739405570  

## Professional Information

Registered as a freelancer (Freiberufler) in Germany.

## Website Information

- **Website**: https://mirkotrotta.com
- **Hosting**: Hetzner Online GmbH, Germany
- **Content**: Personal portfolio and professional information

## Copyright

All content on this website is the property of Mirko Trotta unless otherwise stated.`
    }
  },
  de: {
    privacy: {
      frontmatter: {
        title: "Datenschutzerklärung",
        lastUpdated: "2025-07-27"
      },
      content: `# Datenschutzerklärung

**Zuletzt aktualisiert:** 27. Juli 2025

Diese Datenschutzerklärung erklärt, wie Mirko Trotta ("ich," "mich," oder "mein") Ihre persönlichen Informationen sammelt, verwendet und schützt, wenn Sie meine Website [https://mirkotrotta.com] (die "Website") besuchen. Sie gilt auch für meine zukünftige Geschäftswebsite [https://metacubostudio.com].

## 1. Verantwortlicher für die Datenverarbeitung

**Mirko Trotta**  
Lehrhöfer Straße 22  
63457 Hanau, Deutschland  
E-Mail: hello@mirkotrotta.com  
Telefon: +49 01739405570  

Registriert als Freiberufler in Deutschland.

## 2. Persönliche Daten, die wir sammeln

### 2.1 Informationen, die Sie uns zur Verfügung stellen
- **Kontaktformular** (über Formspree): Name, E-Mail-Adresse, Betreff und Nachrichteninhalt.
- **Newsletter-Anmeldung** (über Buttondown): E-Mail-Adresse und Sprachpräferenz.
- **Technischer Support**: Alle Informationen, die Sie bei der Kontaktaufnahme bereitstellen.

### 2.2 Automatisch gesammelte Informationen
- **Analytics-Daten**: IP-Adresse (möglicherweise anonymisiert), Browsertyp, Geräteinformationen, besuchte Seiten, Verweildauer, verweisende Websites.
- **Cookies**: Cookies für Website-Funktionalität, Analytics, Marketing-Präferenzen.
- **Log-Dateien**: Server-Logs mit IP-Adressen, Browser-Informationen, Zugriffszeiten.
- **Eingebettete Inhalte**: YouTube-Videos, Social-Media-Einbettungen (LinkedIn, X/Twitter), potenzielle KI-Chat-Interfaces.

## 3. Rechtsgrundlage für die Verarbeitung

Wir verarbeiten Ihre persönlichen Daten auf Grundlage von:
- **Einwilligung**: Für Analytics-Cookies, Marketing-Cookies, Newsletter-Anmeldungen.
- **Berechtigtes Interesse**: Für wesentliche Website-Funktionalität, Sicherheit, Kontaktformular-Antworten.
- **Vertragsnotwendigkeit**: Um auf Ihre Anfragen zu antworten und gewünschte Dienstleistungen zu erbringen.

## 4. Wie wir Ihre Daten verwenden

### 4.1 Kontaktformular-Daten
- Antworten auf Ihre Anfragen.
- Kundensupport bereitstellen.
- Geschäftsunterlagen führen.

### 4.2 Newsletter-Daten
- Updates über neue Inhalte oder Dienstleistungen senden.
- Informationen über Projekte bereitstellen.
- Engagement analysieren.

### 4.3 Analytics- und Tracking-Daten
- Website-Nutzung verstehen.
- Leistung und UX verbessern.
- Nutzungsstatistiken erstellen.
- Potenzielle Werbung/Marketing unterstützen (z.B. Google AdSense in der Zukunft).

## 5. Cookies und Tracking-Technologien

Wir verwenden folgende Arten von Cookies:

### 5.1 Notwendige Cookies
- **Zweck**: Wesentliche Website-Funktionen ermöglichen.
- **Rechtsgrundlage**: Berechtigtes Interesse.
- **Ablauf**: Session oder bis zu 1 Jahr.
- **Kann nicht deaktiviert werden**.

### 5.2 Analytics-Cookies
- **Zweck**: Website-Nutzung analysieren, Dienstleistungen verbessern.
- **Rechtsgrundlage**: Einwilligung.
- **Ablauf**: Bis zu 26 Monate.
- **Kann deaktiviert werden**: Über Cookie-Einstellungen.

### 5.3 Marketing-Cookies
- **Zweck**: Marketing-Effektivität messen, personalisierte Inhalte oder Werbung bereitstellen.
- **Rechtsgrundlage**: Einwilligung.
- **Ablauf**: Bis zu 2 Jahre.
- **Kann deaktiviert werden**: Über Cookie-Einstellungen.

Ihre Einwilligung wird über unser benutzerdefiniertes GDPR-konformes Cookie-Banner verwaltet. Nicht-essentielle Cookies werden nur nach Einwilligung gesetzt.

## 6. Drittanbieter-Dienstleistungen

### 6.1 Analytics-Dienstleistungen
- **Google Analytics 4** (mit potenzieller IP-Anonymisierung): [https://policies.google.com/privacy]
- Andere datenschutzfreundliche oder selbst gehostete Optionen (z.B. Umami) können in der Zukunft hinzugefügt werden.

### 6.2 Andere Dienstleistungen
- **Hosting-Anbieter**: Hetzner Online GmbH, Deutschland.
- **E-Mail-Verarbeitung**: Formspree für Kontaktformulare, Buttondown für Newsletter.
- **Eingebettete Inhalte-Anbieter**: YouTube, Social Media (LinkedIn, X/Twitter), potenzielle KI-Chatbot-Anbieter.

## 7. Datenaufbewahrung

- **Kontaktformular-Daten**: Bis zu 2 Jahre ab letztem Kontakt.
- **Newsletter-Anmeldungen**: Bis zur Abmeldung.
- **Analytics-Daten**: Bis zu 26 Monate.
- **Cookie-Daten**: Je nach Cookie-Einstellungen und Präferenzen.`
    },
    terms: {
      frontmatter: {
        title: "Nutzungsbedingungen",
        lastUpdated: "2025-07-27"
      },
      content: `# Nutzungsbedingungen

**Zuletzt aktualisiert:** 27. Juli 2025

Diese Nutzungsbedingungen ("Bedingungen") regeln Ihre Nutzung der Website [https://mirkotrotta.com] (die "Website"), die von Mirko Trotta ("ich," "mich," oder "mein") betrieben wird.

## 1. Annahme der Bedingungen

Durch den Zugriff auf und die Nutzung dieser Website akzeptieren und stimmen Sie den Bedingungen und Bestimmungen dieser Vereinbarung zu.

## 2. Nutzungslizenz

Die Erlaubnis wird gewährt, vorübergehend eine Kopie der Materialien (Informationen oder Software) auf Mirko Trottas Website für persönliche, nicht-kommerzielle vorübergehende Betrachtung herunterzuladen. Dies ist die Gewährung einer Lizenz, nicht einer Übertragung des Eigentums, und unter dieser Lizenz dürfen Sie nicht:

- die Materialien modifizieren oder kopieren;
- die Materialien für kommerzielle Zwecke oder für öffentliche Vorführungen (kommerziell oder nicht-kommerziell) verwenden;
- versuchen, Software auf Mirko Trottas Website zu dekompilieren oder zu reverse-engineeren;
- Urheberrechts- oder andere proprietäre Notationen aus den Materialien entfernen; oder
- die Materialien an eine andere Person übertragen oder die Materialien auf einem anderen Server "spiegeln".

Diese Lizenz wird automatisch beendet, wenn Sie gegen eine dieser Einschränkungen verstoßen, und kann von Mirko Trotta jederzeit beendet werden. Bei der Beendigung Ihrer Betrachtung dieser Materialien oder bei der Beendigung dieser Lizenz müssen Sie alle heruntergeladenen Materialien in Ihrem Besitz zerstören, ob in elektronischem oder gedrucktem Format.

## 3. Haftungsausschluss

Die Materialien auf Mirko Trottas Website werden "wie besehen" bereitgestellt. Mirko Trotta gibt keine Garantien, ausdrücklich oder stillschweigend, und lehnt hiermit alle anderen Garantien ab, einschließlich ohne Einschränkung stillschweigender Garantien oder Bedingungen der Handelsfähigkeit, Eignung für einen bestimmten Zweck oder Nichtverletzung geistigen Eigentums oder anderer Rechteverletzungen.

## 4. Einschränkungen

In keinem Fall haftet Mirko Trotta oder seine Lieferanten für Schäden (einschließlich ohne Einschränkung Schäden für Datenverlust oder Gewinn oder aufgrund von Geschäftsunterbrechung), die sich aus der Nutzung oder Unfähigkeit zur Nutzung der Materialien auf Mirko Trottas Website ergeben, auch wenn Mirko Trotta oder ein von Mirko Trotta autorisierter Vertreter mündlich oder schriftlich über die Möglichkeit solcher Schäden benachrichtigt wurde. Da einige Gerichtsbarkeiten Einschränkungen bei stillschweigenden Garantien oder Haftungsbeschränkungen für Folgeschäden oder Nebenschäden nicht zulassen, gelten diese Einschränkungen möglicherweise nicht für Sie.

## 5. Genauigkeit der Materialien

Die auf Mirko Trottas Website erscheinenden Materialien könnten technische, typografische oder fotografische Fehler enthalten. Mirko Trotta garantiert nicht, dass Materialien auf seiner Website genau, vollständig oder aktuell sind. Mirko Trotta kann Änderungen an den auf seiner Website enthaltenen Materialien jederzeit ohne Vorankündigung vornehmen. Mirko Trotta verpflichtet sich jedoch nicht, die Materialien zu aktualisieren.

## 6. Links

Mirko Trotta hat nicht alle Websites überprüft, die mit seiner Website verlinkt sind, und ist nicht für den Inhalt solcher verlinkten Websites verantwortlich. Die Aufnahme eines Links impliziert keine Befürwortung der Website durch Mirko Trotta. Die Nutzung einer solchen verlinkten Website erfolgt auf eigenes Risiko des Nutzers.

## 7. Änderungen

Mirko Trotta kann diese Nutzungsbedingungen für seine Website jederzeit ohne Vorankündigung überarbeiten. Durch die Nutzung dieser Website stimmen Sie zu, an die dann aktuelle Version dieser Nutzungsbedingungen gebunden zu sein.

## 8. Anwendbares Recht

Diese Bedingungen werden durch die Gesetze Deutschlands bestimmt und ausgelegt, und Sie unterwerfen sich unwiderruflich der ausschließlichen Zuständigkeit der Gerichte in diesem Staat oder Ort.`
    },
    impressum: {
      frontmatter: {
        title: "Impressum",
        lastUpdated: "2025-07-27"
      },
      content: `# Impressum

**Zuletzt aktualisiert:** 27. Juli 2025

## Kontaktinformationen

**Mirko Trotta**  
Lehrhöfer Straße 22  
63457 Hanau, Deutschland  
E-Mail: hello@mirkotrotta.com  
Telefon: +49 01739405570  

## Berufliche Informationen

Registriert als Freiberufler in Deutschland.

## Website-Informationen

- **Website**: https://mirkotrotta.com
- **Hosting**: Hetzner Online GmbH, Deutschland
- **Inhalt**: Persönliches Portfolio und berufliche Informationen

## Urheberrecht

Alle Inhalte auf dieser Website sind das Eigentum von Mirko Trotta, sofern nicht anders angegeben.`
    }
  }
};

/**
 * Get legal content by slug and language
 */
export async function getLegalContent(
  slug: string, 
  language: string = DEFAULT_LANGUAGE
): Promise<LegalData | null> {
  try {
    // First try to get embedded content (for production builds)
    const embeddedContent = EMBEDDED_LEGAL_CONTENT[language as keyof typeof EMBEDDED_LEGAL_CONTENT]?.[slug as keyof typeof EMBEDDED_LEGAL_CONTENT.en];
    
    if (embeddedContent) {
      const htmlContent = markdownToHtml(embeddedContent.content);
      return {
        slug,
        frontmatter: embeddedContent.frontmatter,
        content: embeddedContent.content,
        htmlContent,
        language
      };
    }
    
    // Fallback to file system reading (for development)
    const legalDir = LEGAL_DIR[language as keyof typeof LEGAL_DIR] || LEGAL_DIR[DEFAULT_LANGUAGE];
    const filePath = path.join(legalDir, `${slug}.md`);
    
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter, content } = matter(fileContents);
      const htmlContent = markdownToHtml(content);
      
      return {
        slug,
        frontmatter: frontmatter as LegalFrontmatter,
        content,
        htmlContent,
        language
      };
    }
    
    console.error(`Legal content not found for ${slug} in ${language}`);
    return null;
  } catch (error) {
    console.error(`Error reading legal content for ${slug}:`, error);
    return null;
  }
}

/**
 * Get all available legal content for a language
 */
export function getAllLegalContent(language: string = DEFAULT_LANGUAGE): LegalData[] {
  try {
    const legalContent: LegalData[] = [];
    
    // Get embedded content first
    const embeddedContent = EMBEDDED_LEGAL_CONTENT[language as keyof typeof EMBEDDED_LEGAL_CONTENT];
    if (embeddedContent) {
      for (const [slug, content] of Object.entries(embeddedContent)) {
        const htmlContent = markdownToHtml(content.content);
        legalContent.push({
          slug,
          frontmatter: content.frontmatter,
          content: content.content,
          htmlContent,
          language
        });
      }
    }
    
    return legalContent;
  } catch (error) {
    console.error(`Error reading legal content for language ${language}:`, error);
    return [];
  }
}

/**
 * Check if legal content exists for a given slug and language
 */
export function legalContentExists(slug: string, language: string = DEFAULT_LANGUAGE): boolean {
  try {
    // Check embedded content first
    const embeddedContent = EMBEDDED_LEGAL_CONTENT[language as keyof typeof EMBEDDED_LEGAL_CONTENT]?.[slug as keyof typeof EMBEDDED_LEGAL_CONTENT.en];
    if (embeddedContent) {
      return true;
    }
    
    // Fallback to file system check
    const legalDir = LEGAL_DIR[language as keyof typeof LEGAL_DIR] || LEGAL_DIR[DEFAULT_LANGUAGE];
    const filePath = path.join(legalDir, `${slug}.md`);
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
} 