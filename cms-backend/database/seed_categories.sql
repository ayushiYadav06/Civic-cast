-- Seed categories for CivicCast
-- Run this file against your database to import the default categories.
-- Example: mysql -u your_user -p your_database < database/seed_categories.sql

-- Use INSERT IGNORE to skip if slug already exists (avoid duplicate errors)
INSERT INTO `categories` (`name`, `slug`, `description`, `is_active`) VALUES
('स्थानीय सुशासन', 'local-governance', 'आपके शहर और इलाके की हर महत्वपूर्ण अपडेट | Every important update of your city and locality', 1),
('जनता की आवाज', 'voice-of-people', 'नागरिकों द्वारा उठाए गए मुद्दे और जनमत | Citizen-raised issues and public opinions', 1),
('प्रगति पथ', 'progress-path', 'क्षेत्र में विकास कार्यों की गति को प्रदर्शित करना | Showcasing the pace of development works in the region', 1),
('आपराधिक सतर्कता', 'crime-alert', 'अपराध और सार्वजनिक सुरक्षा से संबंधित आवश्यक जानकारी | Essential information related to crime and public safety', 1),
('ग्राउंड रिपोर्ट', 'ground-report', 'जमीनी हकीकत और सच्चाई को पेश करना | Presenting ground realities and truth', 1),
('Civic कॉस्ट स्पेशल', 'civic-cast-special', 'विशेष खबरें जो आपको कहीं और नहीं मिलेंगी | Exclusive news that you won''t find anywhere else', 1),
('जवाबदेही मीटर', 'accountability-meter', 'कौन से विभाग अपने वादे पूरे कर रहे हैं इसे ट्रैक करना | Tracking which departments are fulfilling their promises', 1),
('आज का सवाल', 'todays-question', 'उन मुद्दों पर ध्यान केंद्रित करना जिन पर शहर को सोचना चाहिए | Focusing on issues that the city must think about', 1),
('सीधे नागरिक से', 'from-citizens', 'व्यक्तिगत नागरिकों के महत्वपूर्ण वास्तविक अनुभव | Important real-life experiences of individual citizens', 1),
('पटरी पर भारत', 'india-on-rails', 'भारतीय रेलवे से संबंधित कहानियां | Stories related to Indian Railways', 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `updated_at` = CURRENT_TIMESTAMP;
