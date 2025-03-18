import pool from './db';

async function seed() {
  try {
    const result = await pool.query(`
      INSERT INTO events 
        (name_en, name_el, date, location, description_en, description_el, image_path, riddle_en, riddle_el, wikipedia_url, details_en, details_el)
      VALUES
        (
          'End of the First Punic War',
          'Τέλος του Πρώτου Καρχηδονιακού Πολέμου',
          '241-03-10 BC 00:00:00',
          'Mediterranean Sea',
          'Rome defeated Carthage in 241 BCE, securing control over Sicily and ending the First Punic War.',
          'Η Ρώμη νίκησε την Καρχηδόνα το 241 π.Χ., εξασφαλίζοντας τον έλεγχο της Σικελίας και τερματίζοντας τον Πρώτο Καρχηδονιακό Πόλεμο.',
          '03_10_first_punic_war_ends.jpg',
          'A decisive naval battle ended the first long war between two ancient powers.',
          'Μια αποφασιστική ναυμαχία έληξε τον πρώτο μεγάλο πόλεμο μεταξύ δύο αρχαίων δυνάμεων.',
          'https://en.wikipedia.org/wiki/Battle_of_the_Aegates',
          'The Battle of the Aegates Islands details',
          'Λεπτομέρειες για τη Ναυμαχία των Αιγατικών Νήσων'
        ),
        (
          'Invention of the Telephone',
          'Η Εφεύρεση του Τηλεφώνου',
          '1876-03-10 00:00:00',
          'Boston, USA',
          'Alexander Graham Bell made the first successful phone call, revolutionizing global communication.',
          'Ο Alexander Graham Bell πραγματοποίησε την πρώτη επιτυχημένη τηλεφωνική κλήση, αλλάζοντας την παγκόσμια επικοινωνία.',
          '03_10_first_phone_call_bell.webp',
          'A call that rang out across the world bridging voices across hidden wires.',
          'Μια κλήση που αντήχησε σε όλο τον κόσμο γεφυρώνοντας φωνές μέσω κρυμμένων καλωδίων.',
          'https://en.wikipedia.org/wiki/History_of_the_telephone',
          'Invention of the Telephone details',
          'Λεπτομέρειες για την Εφεύρεση του Τηλεφώνου'
        ),
        (
          'The Tokyo Firebombing',
          'Η Πυρπόληση του Τόκιο',
          '1945-03-10 00:00:00',
          'Tokyo, Japan',
          'U.S. bombers firebombed Tokyo, killing over 100,000 people, the deadliest air raid in history.',
          'Αμερικανικά βομβαρδιστικά έκαψαν το Τόκιο, σκοτώνοντας πάνω από 100.000 άτομα, στη φονικότερη αεροπορική επιδρομή της ιστορίας.',
          '03_10_tokyo_firebombing.jpg',
          'The most destructive single air attack in human history.',
          'Η πιο καταστροφική μεμονωμένη αεροπορική επίθεση στην ανθρώπινη ιστορία.',
          'https://en.wikipedia.org/wiki/Bombing_of_Tokyo',
          'The Tokyo Firebombing: The Deadliest Air Raid in History details',
          'Λεπτομέρειες για την Πυρπόληση του Τόκιο'
        ),
        (
          'The Tibetan Uprising',
          'Η Θιβετιανή Εξέγερση',
          '1959-03-10 00:00:00',
          'Lhasa, Tibet',
          'Tibetans rose against Chinese rule, leading to the Dalai Lama''s exile to India.',
          'Οι Θιβετιανοί εξεγέρθηκαν ενάντια στην κινεζική κυριαρχία, οδηγώντας τον Δαλάι Λάμα στην εξορία στην Ινδία.',
          '03_10_tibetan_uprising.webp',
          'A people of high peaks and deep traditions rose but lost its leader to exile.',
          'Ένας λαός των υψηλών κορυφών και βαθιών παραδόσεων ξεσηκώθηκε αλλά έχασε τον ηγέτη του στην εξορία.',
          'https://en.wikipedia.org/wiki/1959_Tibetan_uprising',
          'The Tibetan Uprising details',
          'Λεπτομέρειες για τη Θιβετιανή Εξέγερση'
        ),
        (
          'The Jupiter Effect',
          'Η Επίδραση του Δία',
          '1982-03-10 00:00:00',
          'Solar System',
          'Planetary alignment had sparked doomsday predictions, but nothing catastrophic occurred.',
          'Η ευθυγράμμιση των πλανητών προκάλεσε προβλέψεις καταστροφής, αλλά τίποτα καταστροφικό δεν συνέβη.',
          '03_10_jupiter_effect.webp',
          'Maybe the First “Scientific” Doomsday Prediction, planets aligned, but the world stayed still.',
          'Ίσως η πρώτη «επιστημονική» πρόβλεψη καταστροφής, οι πλανήτες ευθυγραμμίστηκαν, αλλά ο κόσμος παρέμεινε ίδιος.',
          'https://en.wikipedia.org/wiki/Jupiter_Effect',
          'The Jupiter Effect details',
          'Λεπτομέρειες για την Επίδραση του Δία'
        ),
        (
          'Roman Empire Bans Jews from Public Office',
          'Η Ρωμαϊκή Αυτοκρατορία Απαγορεύει στους Εβραίους Δημόσια Αξιώματα',
          '418-03-10 00:00:00',
          'Δυτική Ρωμαϊκή Αυτοκρατορία',
          'In 418 AD, the Christianised Roman Empire barred Jews from public office, reinforcing its shift to Christian dominance.',
          'Το 418 μ.Χ., η χριστιανοποιημένη Ρωμαϊκή Αυτοκρατορία απαγόρευσε στους Εβραίους να κατέχουν δημόσια αξιώματα, ενισχύοντας τη στροφή της προς τη χριστιανική κυριαρχία.',
          '03_10_jews_ban_from_office.jpg',
          'A powerful empire barred a religious minority from holding public office.',
          'Μια ισχυρή αυτοκρατορία απαγόρευσε σε μια θρησκευτική μειονότητα να κατέχει δημόσια αξιώματα.',
          'https://en.wikipedia.org/wiki/History_of_the_Jews_in_the_Roman_Empire',
          'Decree barring Jews details',
          'Λεπτομέρειες για το διάταγμα που απέκλειε τους Εβραίους'
        ),
        (
          'The Birth of the French Foreign Legion',
          'Η Γέννηση της Γαλλικής Λεγεώνας των Ξένων',
          '1831-03-10 00:00:00',
          'Γαλλία',
          'In 1831, France established the Foreign Legion, recruiting soldiers from around the world for military service.',
          'Το 1831, η Γαλλία ίδρυσε τη Λεγεώνα των Ξένων, στρατολογώντας στρατιώτες από όλο τον κόσμο για στρατιωτική θητεία.',
          '03_10_legion_etrangere.png',
          'A band of outcasts, warriors, and wanderers found a new flag to fight for.',
          'Μια ομάδα απόκληρων, πολεμιστών και περιπλανώμενων βρήκε μια νέα σημαία για να πολεμήσει.',
          'https://en.wikipedia.org/wiki/French_Foreign_Legion',
          'The French Foreign Legion details',
          'Λεπτομέρειες για τη Γαλλική Λεγεώνα των Ξένων'
        ),
        (
          'The Dot-com Bubble Peaks',
          'Η Φούσκα του Διαδικτύου Φτάνει στην Κορυφή',
          '2000-03-10 00:00:00',
          'Ηνωμένες Πολιτείες',
          'The dot-com bubble peaked, leading to the collapse of tech stocks and a burst in the internet market.',
          'Η φούσκα των dot-com έφτασε στην κορυφή, οδηγώντας στην κατάρρευση των μετοχών της τεχνολογίας και στην έκρηξη της αγοράς του διαδικτύου.',
          '03_10_dot_com_bubble.webp',
          'Click, invest, peak before collapse.',
          'Κλικ, επένδυση, κορύφωση πριν την κατάρρευση.',
          'https://en.wikipedia.org/wiki/Dot-com_bubble',
          'The dot-com bubble peaked, leading to the collapse of tech stocks and a burst in the internet market. The dot-com bubble peaked, leading to the collapse of tech stocks and a burst in the internet market. The dot-com bubble peaked, leading to the collapse of tech stocks and a burst in the internet market. The dot-com bubble peaked, leading to the collapse of tech stocks and a burst in the internet market. The dot-com bubble peaked, leading to the collapse of tech stocks and a burst in the internet market. The dot-com bubble peaked, leading to the collapse of tech stocks and a burst in the internet market. The dot-com bubble peaked, leading to the collapse of tech stocks and a burst in the internet market.',
          'Λεπτομέρειες για τη Φούσκα του Διαδικτύου'
        ),
        (
          'Cuba''s Coup: Batista Seizes Power',
          'Το Πραξικόπημα στην Κούβα: Ο Μπατίστα Αναλαμβάνει την Εξουσία',
          '1952-03-10 00:00:00',
          'Κούβα',
          'General Batista led a coup in Cuba, overthrowing the government and establishing a dictatorship, sparking the Cuban Revolution.',
          'Ο στρατηγός Μπατίστα ηγήθηκε πραξικοπήματος στην Κούβα, ανατρέποντας την κυβέρνηση και εγκαθιστώντας δικτατορία, πυροδοτώντας την Κουβανική Επανάσταση.',
          '03_10_batista_cuba_coup.jpg',
          'A military leader overthrew the government, setting the stage for revolution.',
          'Ένας στρατιωτικός ηγέτης ανέτρεψε την κυβέρνηση, προετοιμάζοντας το έδαφος για την επανάσταση.',
          'https://en.wikipedia.org/wiki/Fulgencio_Batista',
          'Batista led a military coup in Cuba details',
          'Λεπτομέρειες για το πραξικόπημα του Μπατίστα στην Κούβα'
        ),
        (
          'The Sound of Silence - Simon & Garfunkel',
          'The Sound of Silence - Simon & Garfunkel',
          '1964-03-10 00:00:00',
          'Ηνωμένες Πολιτείες',
          'Simon & Garfunkel recorded "The Sound of Silence," which became an iconic anthem of the 1960s.',
          'Οι Simon & Garfunkel ηχογράφησαν το "The Sound of Silence," το οποίο έγινε εμβληματικός ύμνος της δεκαετίας του 1960.',
          'backend/public03_10_sound_of_silence.jpg',
          'Hello darkness, my old friend.',
          'Hello darkness, my old friend.',
          'https://en.wikipedia.org/wiki/The_Sound_of_Silence',
          'In 1964, Simon & Garfunkel recorded The Sound of Silence details',
          'Το 1964, οι Simon & Garfunkel ηχογράφησαν το The Sound of Silence'
        )
      RETURNING *;
    `);

    console.log('Seeding successful. Inserted rows:');
    console.table(result.rows);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    pool.end();
  }
}

seed();


