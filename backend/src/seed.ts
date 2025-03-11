import pool from './db';

async function seed() {
  try {
    const result = await pool.query(`
      INSERT INTO events 
        (name_en, name_el, date, location, description_en, description_el, imageUrl, riddle_en, riddle_el, wikipediaUrl, details_en, details_el)
      VALUES
        (
          'End of the First Punic War',
          'Τέλος του Πρώτου Καρχηδονιακού Πολέμου',
          '241-03-10 00:00:00',
          'Mediterranean Sea',
          'Rome defeated Carthage in 241 BCE, securing control over Sicily and ending the First Punic War.',
          'Η Ρώμη νίκησε την Καρχηδόνα το 241 π.Χ., εξασφαλίζοντας τον έλεγχο της Σικελίας και τερματίζοντας τον Πρώτο Καρχηδονιακό Πόλεμο.',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Battle_of_Aegates_Islands.jpg/800px-Battle_of_Aegates_Islands.jpg',
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
          'https://www.protagon.gr/wp-content/uploads/2018/03/F4-GrahamBell.jpg',
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
          'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Tokyo_1945-3-10-1.jpg/1280px-Tokyo_1945-3-10-1.jpg',
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
          'https://ichef.bbci.co.uk/images/ic/640x360/p0162mb2.jpg',
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
          'https://upload.wikimedia.org/wikipedia/en/e/e7/The_Jupiter_Effect.jpg',
          'Maybe the First “Scientific” Doomsday Prediction, planets aligned, but the world stayed still.',
          'Ίσως η πρώτη «επιστημονική» πρόβλεψη καταστροφής, οι πλανήτες ευθυγραμμίστηκαν, αλλά ο κόσμος παρέμεινε ίδιος.',
          'https://en.wikipedia.org/wiki/Jupiter_Effect',
          'The Jupiter Effect details',
          'Λεπτομέρειες για την Επίδραση του Δία'
        ),
        (
          'Roman Empire Bars Jews from Public Office',
          'Η Ρωμαϊκή Αυτοκρατορία Απαγορεύει στους Εβραίους Δημόσια Αξιώματα',
          '418-03-10 00:00:00',
          'Δυτική Ρωμαϊκή Αυτοκρατορία',
          'In 418 AD, the Christianised Roman Empire barred Jews from public office, reinforcing its shift to Christian dominance.',
          'Το 418 μ.Χ., η χριστιανοποιημένη Ρωμαϊκή Αυτοκρατορία απαγόρευσε στους Εβραίους να κατέχουν δημόσια αξιώματα, ενισχύοντας τη στροφή της προς τη χριστιανική κυριαρχία.',
          'https://www.heritage-history.com/books/church/jerusalem/zpage121.gif',
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
          'https://fr.wikipedia.org/wiki/L%C3%A9gion_%C3%A9trang%C3%A8re#/media/Fichier:L%C3%A9gion_%C3%A9trang%C3%A8re_et_tirailleurs_indig%C3%A8nes.jpg',
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
          'https://moneymorning.com/wp-content/blogs.dir/1/files/2015/06/shutterstock_162413930.jpg',
          'Click, invest, peak before collapse.',
          'Κλικ, επένδυση, κορύφωση πριν την κατάρρευση.',
          'https://en.wikipedia.org/wiki/Dot-com_bubble',
          'The dot-com bubble details',
          'Λεπτομέρειες για τη Φούσκα του Διαδικτύου'
        ),
        (
          'Cuba''s Coup: Batista Seizes Power',
          'Το Πραξικόπημα στην Κούβα: Ο Μπατίστα Αναλαμβάνει την Εξουσία',
          '1952-03-10 00:00:00',
          'Κούβα',
          'General Batista led a coup in Cuba, overthrowing the government and establishing a dictatorship, sparking the Cuban Revolution.',
          'Ο στρατηγός Μπατίστα ηγήθηκε πραξικοπήματος στην Κούβα, ανατρέποντας την κυβέρνηση και εγκαθιστώντας δικτατορία, πυροδοτώντας την Κουβανική Επανάσταση.',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/BatistaDC1938.jpg/280px-BatistaDC1938.jpg',
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
          'https://68.media.tumblr.com/1ea0e0b9974786565c97e5bf57f8b641/tumblr_ol33ik4TiG1snb6qwo1_1280.jpg',
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


