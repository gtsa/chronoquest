import pool from './db';

async function seed() {
  try {
    const result = await pool.query(`
      INSERT INTO events 
        (name, date, location, description, imageUrl, riddle, wikipediaUrl, details)
      VALUES
        (
          'End of the First Punic War',
          '241-03-10 00:00:00',
          'Mediterranean Sea',
          'Rome defeated Carthage in 241 BCE, securing control over Sicily and ending the First Punic War.',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Battle_of_Aegates_Islands.jpg/800px-Battle_of_Aegates_Islands.jpg',
          'A decisive naval battle ended the first long war between two ancient powers.',
          'https://en.wikipedia.org/wiki/Battle_of_the_Aegates',
          'The Battle of the Aegates Islands details'
        ),
        (
          'Invention of the Telephone',
          '1876-03-10 00:00:00',
          'Boston, USA',
          'Alexander Graham Bell made the first successful phone call, revolutionising global communication.',
          'https://www.protagon.gr/wp-content/uploads/2018/03/F4-GrahamBell.jpg',
          'A call that rang out across the world bridging voices across hidden wires.',
          'https://en.wikipedia.org/wiki/History_of_the_telephone',
          'Invention of the Telephone details'
        ),
        (
          'The Tokyo Firebombing',
          '1945-03-10 00:00:00',
          'Tokyo, Japan',
          'U.S. bombers firebombed Tokyo, killing over 100,000 people, the deadliest air raid in history.',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Tokyo_1945-3-10-1.jpg/1280px-Tokyo_1945-3-10-1.jpg',
          'The most destructive single air attack in human history.',
          'https://en.wikipedia.org/wiki/Bombing_of_Tokyo',
          'The Tokyo Firebombing: The Deadliest Air Raid in History details'
        ),
        (
          'The Tibetan Uprising',
          '1959-03-10 00:00:00',
          'Lhasa, Tibet',
          'Tibetans rose against Chinese rule, leading to the Dalai Lama''s exile to India.',
          'https://ichef.bbci.co.uk/images/ic/640x360/p0162mb2.jpg',
          'A people of high peaks and deep traditions rose but lost its leader to exile.',
          'https://en.wikipedia.org/wiki/1959_Tibetan_uprising',
          'The Tibetan Uprising details'
        ),
        (
          'The Jupiter Effect',
          '1982-03-10 00:00:00',
          'Solar System',
          'Planetary alignment had sparked doomsday predictions, but nothing catastrophic occurred.',
          'https://upload.wikimedia.org/wikipedia/en/e/e7/The_Jupiter_Effect.jpg',
          'Maybe the First “Scientific” Doomsday Prediction, planets aligned, but the world stayed still.',
          'https://en.wikipedia.org/wiki/Jupiter_Effect',
          'TheJupyter Effect details'
        ),
        (
          'Roman Empire Bars Jews from Public Office',
          '418-03-10 00:00:00',
          'Western Roman Empire',
          'In 418 AD, the Christianised Roman Empire barred Jews from public office, reinforcing its shift to Christian dominance.',
          'https://www.heritage-history.com/books/church/jerusalem/zpage121.gif',
          'A powerful empire barred a religious minority from holding public office.',
          'https://en.wikipedia.org/wiki/History_of_the_Jews_in_the_Roman_Empire',
          'Decree barring Jews details'
        ),
        (
          'The Birth of the French Foreign Legion',
          '1831-03-10 00:00:00',
          'France',
          'In 1831, France established the Foreign Legion, recruiting soldiers from around the world for military service.',
          'https://fr.wikipedia.org/wiki/L%C3%A9gion_%C3%A9trang%C3%A8re#/media/Fichier:L%C3%A9gion_%C3%A9trang%C3%A8re_et_tirailleurs_indig%C3%A8nes.jpg',
          'A band of outcasts, warriors, and wanderers found a new flag to fight for.',
          'https://en.wikipedia.org/wiki/French_Foreign_Legion',
          'The French Foreign Legion details'
        ),
        (
          'The Dot-com Bubble Peaks',
          '2000-03-10 00:00:00',
          'United States',
          'The dot-com bubble peaked, leading to the collapse of tech stocks and a burst in the internet market.',
          'https://moneymorning.com/wp-content/blogs.dir/1/files/2015/06/shutterstock_162413930.jpg',
          'Click, invest, peak before collapse.',
          'https://en.wikipedia.org/wiki/Dot-com_bubble',
          'The dot-com bubble details'
        ),
        (
          'Cuba''s Coup: Batista Seizes Power',
          '1952-03-10 00:00:00',
          'Cuba',
          'General Batista led a coup in Cuba, overthrowing the government and establishing a dictatorship, sparking the Cuban Revolution.',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/BatistaDC1938.jpg/280px-BatistaDC1938.jpg',
          'A military leader overthrew the government, setting the stage for revolution.',
          'https://en.wikipedia.org/wiki/Fulgencio_Batista',
          'Batista led a military coup in Cuba details'
        ),
        (
          'The Sound of Silence - Simon & Garfunkel',
          '1964-03-10 00:00:00',
          'United States',
          'Simon & Garfunkel recorded "The Sound of Silence," which became an iconic anthem of the 1960s.',
          'https://68.media.tumblr.com/1ea0e0b9974786565c97e5bf57f8b641/tumblr_ol33ik4TiG1snb6qwo1_1280.jpg',
          'Hello darkness, my old friend.',
          'https://en.wikipedia.org/wiki/The_Sound_of_Silence',
          'In 1964, Simon & Garfunkel recorded The Sound of Silence details'
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
