<template>
  <LegalDocument>
    <template v-if="locale === 'km'">
      <h1>គោលការណ៍ភាពឯកជន</h1>
      <span class="badge">កែប្រែចុងក្រោយ៖ ថ្ងៃទី១៥ ខែសីហា ឆ្នាំ២០២៦</span>
      <p class="intro">
        គោលការណ៍ភាពឯកជននេះ ពន្យល់ពីព័ត៌មានដែល SabayRent ("យើង") ប្រមូលពីអ្នកប្រើប្រាស់ ("អ្នក")
        របៀបដែលយើងប្រើប្រាស់ព័ត៌មាននោះ និងជម្រើសដែលអ្នកមាន។ គោលការណ៍នេះអនុវត្តលើគេហទំព័រ កម្មវិធី និងសេវាកម្មពាក់ព័ន្ធរបស់ SabayRent។
      </p>

      <h2 id="information-we-collect">១. ព័ត៌មានដែលយើងប្រមូល</h2>

      <h3>១.១ ព័ត៌មានគណនី</h3>
      <p>នៅពេលអ្នកចុះឈ្មោះ ឬចូលគណនី យើងប្រមូល៖</p>
      <ul>
        <li>ឈ្មោះ អាសយដ្ឋានអ៊ីមែល និងពាក្យសម្ងាត់ (យើងរក្សាទុកពាក្យសម្ងាត់របស់អ្នកដោយសុវត្ថិភាព ហើយមិនអាចចូលមើល ឬទាញយកជាទម្រង់ធម្មតាបានឡើយ)</li>
        <li>លេខទូរស័ព្ទ រួមទាំងថាតើលេខនោះជាទូរស័ព្ទធម្មតា ឬភ្ជាប់តាមរយៈ Telegram</li>
        <li>រូបភាពប្រវត្តិរូប ប្រសិនបើអ្នកបានបញ្ចូល ដែលរក្សាទុកនៅលើ Cloudflare R2</li>
        <li>តួនាទីគណនី (អ្នកជួល ម្ចាស់អចលនទ្រព្យ ឬអ្នកគ្រប់គ្រង)</li>
        <li>ចំណូលចិត្តភាពមើលឃើញរបស់អ្នក — ថាតើលេខទូរស័ព្ទ Telegram ឬអ៊ីមែលរបស់អ្នកបង្ហាញដល់អ្នកដទៃឬអត់</li>
      </ul>
      <p>ប្រសិនបើអ្នកចូលគណនីតាមរយៈ Google ឬ Telegram យើងទទួលបានអ៊ីមែល និងឈ្មោះរបស់អ្នក (Google) ឬលេខសម្គាល់អ្នកប្រើប្រាស់ ឈ្មោះ និងឈ្មោះអ្នកប្រើប្រាស់ Telegram (Telegram) ពីអ្នកផ្តល់សេវាទាំងនោះ ដើម្បីបង្កើត ឬផ្គូផ្គងគណនីរបស់អ្នក។ យើងមិនទទួលបានពាក្យសម្ងាត់ Google ឬ Telegram របស់អ្នកនោះទេ។</p>

      <h3>១.២ ការផ្សាយអចលនទ្រព្យ (ម្ចាស់អចលនទ្រព្យ)</h3>
      <p>ប្រសិនបើអ្នកផ្សាយអចលនទ្រព្យ យើងប្រមូល និងបោះផ្សាយ៖ អាសយដ្ឋាន ទីតាំងប្រហែល (ខេត្ត/ស្រុក និងជម្រើសទីតាំងជាក់លាក់ latitude/longitude ព្រមទាំងតំណភ្ជាប់ទីតាំង) តម្លៃ ប្រាក់កក់ ព័ត៌មានលម្អិតបន្ទប់ (បន្ទប់គេង បន្ទប់ទឹក ទំហំ ជាន់) សម្ភារៈបរិក្ខារ វិន័យផ្ទះ ព័ត៌មានចំណតរថយន្ត ភាពទំនេរ និងរូបភាពនៃអចលនទ្រព្យ។</p>
      <p>ដោយបោះផ្សាយការផ្សាយមួយ អ្នកអនុញ្ញាតឱ្យយើងដំណើរការ និងបង្ហាញខ្លឹមសារនេះជាសាធារណៈ — រួមទាំងរូបភាពដែលរក្សាទុកនៅលើ Cloudflare R2 — ដើម្បីផ្តល់សេវាកម្មផ្សាយ។</p>

      <h3>១.៣ ទិន្នន័យប្រើប្រាស់ និងសកម្មភាព</h3>
      <p>យើងក៏ប្រមូលផងដែរ៖</p>
      <ul>
        <li>អចលនទ្រព្យដែលអ្នករក្សាទុកជាចំណូលចិត្ត</li>
        <li>ចំនួនចូលមើលអចលនទ្រព្យ (ជាទិន្នន័យសរុប មិនភ្ជាប់ជាមួយអត្តសញ្ញាណរបស់អ្នកនៅក្នុងរបាយការណ៍ទេ)</li>
        <li>ការស្វែងរកតាមទីតាំង — ប្រជាប្រិយភាពនៃការស្វែងរកខេត្ត/ស្រុក ជាទិន្នន័យសរុប</li>
        <li>របាយការណ៍ដែលអ្នកដាក់ប្រឆាំងនឹងការផ្សាយណាមួយ (ប្រភេទ និងការពិពណ៌នារបាយការណ៍)</li>
        <li>មតិកែលម្អ ឬរបាយការណ៍កំហុសដែលអ្នកដាក់ស្នើ</li>
        <li>ព័ត៌មានបច្ចេកទេសជាមូលដ្ឋានសម្រាប់គោលបំណងសុវត្ថិភាព — ដូចជាអាសយដ្ឋាន IP ព័ត៌មានកម្មវិធីរុករក/ឧបករណ៍ និងសកម្មភាពដែលបានធ្វើនៅលើគណនីរបស់អ្នក</li>
      </ul>

      <h3>១.៤ ទិន្នន័យផ្ទៀងផ្ទាត់អត្តសញ្ញាណ</h3>
      <ul>
        <li>លេខកូដ OTP សម្រាប់ការចុះឈ្មោះ និងការកំណត់ពាក្យសម្ងាត់ឡើងវិញ ដែលផុតកំណត់ក្នុងរយៈពេល ១០ នាទី</li>
        <li>ព័ត៌មានសម័យប្រើប្រាស់ និងការផ្ទៀងផ្ទាត់អត្តសញ្ញាណ ដែលចាំបាច់សម្រាប់រក្សាការចូលគណនី និងជួយធានាសុវត្ថិភាពគណនីរបស់អ្នក រហូតដល់អ្នកចាកចេញ កំណត់ពាក្យសម្ងាត់ឡើងវិញ ឬវាផុតកំណត់ដោយស្វ័យប្រវត្តិ</li>
      </ul>

      <h2 id="how-we-use-it">២. របៀបដែលយើងប្រើប្រាស់ព័ត៌មានរបស់អ្នក</h2>
      <p>យើងប្រើប្រាស់ព័ត៌មានរបស់អ្នកដើម្បី៖</p>
      <ul>
        <li>បង្កើត និងធានាសុវត្ថិភាពគណនីរបស់អ្នក (ការផ្ទៀងផ្ទាត់អត្តសញ្ញាណ ការផ្ទៀងផ្ទាត់ OTP ការកំណត់ពាក្យសម្ងាត់ឡើងវិញ)</li>
        <li>អនុញ្ញាតឱ្យអ្នកផ្សាយ រុករក ស្វែងរក និងរក្សាទុកអចលនទ្រព្យជាចំណូលចិត្ត</li>
        <li>បង្ហាញស្ថិតិសរុបដល់ម្ចាស់អចលនទ្រព្យអំពីការផ្សាយរបស់ពួកគេ (ចំនួនចូលមើល ចំណូលចិត្ត)</li>
        <li>ជូនដំណឹងដល់ម្ចាស់អចលនទ្រព្យ និងអ្នកគ្រប់គ្រងនៅពេលការផ្សាយត្រូវបានរាយការណ៍ ព្រមទាំងជូនដំណឹងអ្នកគ្រប់គ្រងអំពីការដាក់ស្នើមតិកែលម្អ</li>
        <li>ផ្ញើលេខកូដ OTP ដល់អ្នកតាមអ៊ីមែល ឬ Telegram</li>
        <li>រកឃើញការកេងប្រវ័ញ្ច ស៊ើបអង្កេតរបាយការណ៍ និងរក្សាសុវត្ថិភាពវេទិកា</li>
        <li>អនុវត្តគោលការណ៍វេទិកា — ដូចជាម៉ូដថែទាំ ឬដែនកំណត់ការផ្សាយ — ដែលកំណត់ដោយអ្នកគ្រប់គ្រង</li>
      </ul>
      <p>យើងមិនលក់ព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នកទៅភាគីទីបីនោះទេ។ បច្ចុប្បន្ន យើងមិនទាន់ប្រើទិន្នន័យរបស់អ្នកសម្រាប់ការផ្សាយពាណិជ្ជកម្មពីភាគីទីបីនោះទេ ទោះបីជាយើងមានផែនការណែនាំសេវាផ្សាយពាណិជ្ជកម្មពីភាគីទីបីនាពេលអនាគតក៏ដោយ — សូមមើលផ្នែក "ការផ្សាយពាណិជ្ជកម្ម" ខាងក្រោម។</p>

      <h2 id="who-we-share-with">៣. អ្នកដែលយើងចែករំលែកព័ត៌មានជាមួយ</h2>
      <p>យើងចែករំលែកទិន្នន័យតែតាមតម្រូវការក្នុងការដំណើរការវេទិកាប៉ុណ្ណោះ៖</p>
      <table>
        <thead>
          <tr>
            <th>អ្នកទទួល</th>
            <th>អ្វីដែលបានចែករំលែក</th>
            <th>គោលបំណង</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>អ្នកប្រើប្រាស់ផ្សេងទៀត</td>
            <td>ឈ្មោះរបស់អ្នក និង — ប្រសិនបើអ្នកអនុញ្ញាត — លេខទូរស័ព្ទ ឈ្មោះអ្នកប្រើ Telegram ឬអ៊ីមែល ព្រមទាំងការផ្សាយដែលបានបោះផ្សាយរបស់អ្នក</td>
            <td>ដើម្បីឱ្យអ្នកជួល និងម្ចាស់អចលនទ្រព្យអាចទាក់ទងគ្នាបាន</td>
          </tr>
          <tr>
            <td>Cloudflare R2</td>
            <td>រូបភាពអចលនទ្រព្យ និងរូបភាពប្រវត្តិរូប</td>
            <td>ការផ្ទុក និងបង្ហាញរូបភាព</td>
          </tr>
          <tr>
            <td>Telegram</td>
            <td>សារដែលមានលេខកូដ OTP ការជូនដំណឹងអំពីរបាយការណ៍ និងមតិកែលម្អ</td>
            <td>ការផ្ញើការជូនដំណឹងដែលអ្នក ឬអ្នកគ្រប់គ្រងបានធ្វើឱ្យកើតឡើង</td>
          </tr>
          <tr>
            <td>Google</td>
            <td>ព័ត៌មានផ្ទៀងផ្ទាត់សម្រាប់ការចូលគណនី</td>
            <td>ការចូលគណនីតាមរយៈ Google</td>
          </tr>
          <tr>
            <td>Gmail / SMTP</td>
            <td>អ៊ីមែល OTP និងអ៊ីមែលជូនដំណឹង</td>
            <td>ការផ្ញើការជូនដំណឹងតាមអ៊ីមែល</td>
          </tr>
          <tr>
            <td>អ្នកគ្រប់គ្រងវេទិកា</td>
            <td>របាយការណ៍ មតិកែលម្អ កំណត់ត្រាសវនកម្ម ស្ថានភាពគណនី</td>
            <td>ការត្រួតពិនិត្យខ្លឹមសារ និងការគ្រប់គ្រងវេទិកា</td>
          </tr>
        </tbody>
      </table>
      <p>យើងមិនចែករំលែកទិន្នន័យរបស់អ្នកជាមួយអ្នកជួញដូរទិន្នន័យនោះទេ។ សេវា Google ខាងលើប្រើសម្រាប់ការចូលគណនីតាម Google ប៉ុណ្ណោះ ហើយខុសគ្នាទាំងស្រុងពីការផ្សាយពាណិជ្ជកម្មរបស់ Google។ ប្រសិនបើយើងណែនាំសេវាផ្សាយពាណិជ្ជកម្មពីភាគីទីបីដូចរៀបរាប់នៅផ្នែក "ការផ្សាយពាណិជ្ជកម្ម" ខាងក្រោម Google និងដៃគូផ្សាយពាណិជ្ជកម្មផ្សេងទៀតអាចទទួលបានខូគី និងបច្ចេកវិទ្យាស្រដៀងគ្នា ព្រមទាំងព័ត៌មានបច្ចេកទេសអំពីកម្មវិធីរុករក ឬឧបករណ៍របស់អ្នក សម្រាប់បង្ហាញ និងវាស់វែងការផ្សាយពាណិជ្ជកម្ម — មិនមែនព័ត៌មានគណនីពេញលេញរបស់អ្នកទេ។</p>

      <h2 id="retention">៤. ការរក្សាទុកទិន្នន័យ</h2>
      <ul>
        <li>ទិន្នន័យគណនីត្រូវបានរក្សាទុកដរាបណាគណនីរបស់អ្នកនៅសកម្ម។</li>
        <li>លេខកូដ OTP ត្រូវបានលុបចោលភ្លាមៗបន្ទាប់ពីប្រើប្រាស់ ឬនៅពេលផុតកំណត់ (១០ នាទី)។</li>
        <li>ព័ត៌មានសម័យប្រើប្រាស់ត្រូវបានធ្វើឱ្យគ្មានសុពលភាពនៅពេលអ្នកចាកចេញ ឬកំណត់ពាក្យសម្ងាត់ឡើងវិញ ហើយផុតកំណត់ដោយស្វ័យប្រវត្តិបន្ទាប់ពីរយៈពេលដែលមិនប្រើប្រាស់។</li>
        <li>កំណត់ត្រាសុវត្ថិភាព និងសវនកម្ម ត្រូវបានរក្សាទុកតែក្នុងរយៈពេលចាំបាច់សមហេតុផលប៉ុណ្ណោះ សម្រាប់គោលបំណងសុវត្ថិភាព ការទប់ស្កាត់ការកេងប្រវ័ញ្ច ការដោះស្រាយបញ្ហា និងកាតព្វកិច្ចផ្លូវច្បាប់។</li>
      </ul>
      <p>ប្រសិនបើអ្នកលុបគណនីរបស់អ្នក យើងនឹងលុប ឬធ្វើឱ្យអនាមិកនូវព័ត៌មានផ្ទាល់ខ្លួនដែលពាក់ព័ន្ធនឹងគណនីរបស់អ្នក — រួមទាំងលេខទូរស័ព្ទ និងសញ្ញាសម័យប្រើប្រាស់ ហើយការផ្សាយ និងខ្លឹមសារពាក់ព័ន្ធរបស់អ្នកអាចនឹងត្រូវដក — លើកលែងតែក្នុងករណីយើងត្រូវរក្សាទុកព័ត៌មានមួយចំនួនតាមតម្រូវការសមហេតុផលសម្រាប់គោលបំណងសុវត្ថិភាព ការទប់ស្កាត់ការកេងប្រវ័ញ្ច ការដោះស្រាយវិវាទ ឬកាតព្វកិច្ចផ្លូវច្បាប់។ ដំណើរការនេះមិនតែងតែធានាការលុបទិន្នន័យទាំងអស់ភ្លាមៗនោះទេ។</p>

      <h2 id="your-rights">៥. ជម្រើស និងសិទ្ធិរបស់អ្នក</h2>
      <ul>
        <li>ការគ្រប់គ្រងភាពមើលឃើញ — អ្នកអាចលាក់លេខទូរស័ព្ទ Telegram ឬអ៊ីមែលរបស់អ្នកពីការផ្សាយសាធារណៈបានគ្រប់ពេលវេលានៅក្នុងការកំណត់ប្រវត្តិរូបរបស់អ្នក។</li>
        <li>ការចូលមើល និងកែតម្រូវ — អ្នកអាចមើល និងកែប្រែព័ត៌មានប្រវត្តិរូបរបស់អ្នកដោយផ្ទាល់នៅក្នុងកម្មវិធី។</li>
        <li>ការលុបគណនី — អ្នកអាចស្នើសុំលុបគណនីរបស់អ្នកដោយទាក់ទងមកយើង។ យើងនឹងលុប ឬធ្វើឱ្យអនាមិកទិន្នន័យរបស់អ្នកដូចបានពិពណ៌នានៅផ្នែក "ការរក្សាទុកទិន្នន័យ" ខាងលើ ដំណើរការនេះអាចមិនកើតឡើងភ្លាមៗនោះទេ ហើយកំណត់ត្រាមួយចំនួនអាចត្រូវការរក្សាទុកសម្រាប់ហេតុផលសុវត្ថិភាព ការទប់ស្កាត់ការកេងប្រវ័ញ្ច ការដោះស្រាយវិវាទ ឬច្បាប់។</li>
        <li>សុវត្ថិភាពសម័យប្រើប្រាស់ — អ្នកអាចចាកចេញបានគ្រប់ពេលវេលា ដែលនឹងបញ្ចប់សម័យប្រើប្រាស់សកម្មរបស់អ្នក។ ការកំណត់ពាក្យសម្ងាត់ឡើងវិញ នឹងធ្វើឱ្យសម័យប្រើប្រាស់សកម្មទាំងអស់គ្មានសុពលភាព។</li>
      </ul>

      <h2 id="security">៦. សុវត្ថិភាព</h2>
      <ul>
        <li>ពាក្យសម្ងាត់ និងលេខកូដ OTP ត្រូវបានការពារដោយវិធានការសុវត្ថិភាពសមស្រប ហើយមិនដែលរក្សាទុកជាទម្រង់ធម្មតាឡើយ។</li>
        <li>យើងប្រើ HTTPS ដើម្បីអ៊ិនគ្រីបទិន្នន័យដែលបញ្ជូនរវាងឧបករណ៍របស់អ្នក និងវេទិកា។</li>
        <li>ការចូលប្រើមុខងារអ្នកគ្រប់គ្រង ទាមទារគណនីដែលបានផ្ទៀងផ្ទាត់ជាមួយតួនាទីអ្នកគ្រប់គ្រង។</li>
        <li>យើងកំណត់ចំនួនដងដែលសកម្មភាពសំខាន់ៗ — ដូចជាការចូលគណនី ការចុះឈ្មោះ ការស្នើសុំលេខកូដផ្ទៀងផ្ទាត់ និងការរាយការណ៍ — អាចធ្វើឡើងក្នុងរយៈពេលខ្លី ដើម្បីកាត់បន្ថយការកេងប្រវ័ញ្ច។</li>
      </ul>
      <p>គ្មានប្រព័ន្ធណាមួយមានសុវត្ថិភាព ១០០% នោះទេ ហើយយើងមិនអាចធានាសុវត្ថិភាពពេញលេញនៃព័ត៌មានដែលបញ្ជូនទៅកាន់វេទិកាបានឡើយ។</p>

      <h2 id="advertising">៧. ការផ្សាយពាណិជ្ជកម្ម</h2>
      <p>បច្ចុប្បន្ន SabayRent មិនទាន់បង្ហាញការផ្សាយពាណិជ្ជកម្មនោះទេ។ យើងមានផែនការណែនាំការផ្សាយពាណិជ្ជកម្មនៅលើវេទិកា ដែលអាចរួមបញ្ចូលសេវាផ្សាយពាណិជ្ជកម្មពីភាគីទីបី ដូចជា Google (ឧទាហរណ៍ Google AdSense)។</p>
      <p>នៅពេលដែលបានណែនាំ Google និងដៃគូផ្សាយពាណិជ្ជកម្មរបស់ខ្លួន អាចប្រើខូគី និងបច្ចេកវិទ្យាស្រដៀងគ្នា ព្រមទាំងព័ត៌មានបច្ចេកទេសអំពីកម្មវិធីរុករក ឬឧបករណ៍របស់អ្នក ដើម្បីបង្ហាញការផ្សាយពាណិជ្ជកម្ម វាស់វែងប្រសិទ្ធភាព ទប់ស្កាត់ការក្លែងបន្លំ និង — ក្នុងករណីអាចអនុវត្តបាន — ធ្វើឱ្យការផ្សាយពាណិជ្ជកម្មសមស្របតាមចំណូលចិត្តរបស់អ្នក។ បច្ចេកវិទ្យាទាំងនេះខុសពីសេវាចូលគណនីតាម Google ដែលបានរៀបរាប់នៅផ្នែក "អ្នកដែលយើងចែករំលែកព័ត៌មានជាមួយ" ខាងលើ ដែលប្រើសម្រាប់ការចូលគណនីតែប៉ុណ្ណោះ។ យើងមិនប្រើព័ត៌មានទំនាក់ទំនងឯកជន (ដូចជាលេខទូរស័ព្ទ ឬអ៊ីមែលរបស់អ្នក) ឬព័ត៌មានគណនីឯកជនផ្សេងទៀតដោយផ្ទាល់ ដើម្បីកំណត់គោលដៅការផ្សាយពាណិជ្ជកម្មដល់អ្នកនោះទេ។</p>
      <p>យើងនឹងធ្វើបច្ចុប្បន្នភាពគោលការណ៍ភាពឯកជននេះ មុនពេលសេវាផ្សាយពាណិជ្ជកម្មណាមួយចាប់ផ្តើមដំណើរការជាផ្លូវការ ហើយផ្នែកខូគីខាងក្រោមពន្យល់ពីរបៀបដែលអ្នកអាចគ្រប់គ្រងខូគីទាក់ទងនឹងការផ្សាយពាណិជ្ជកម្មនៅពេលវាត្រូវបានណែនាំ។</p>

      <h2 id="cookies">៨. ខូគី និងបច្ចេកវិទ្យាស្រដៀងគ្នា</h2>
      <p><strong>ខូគីចាំបាច់</strong> ត្រូវការសម្រាប់ឱ្យវេទិកាដំណើរការ ហើយមិនអាចបិទបាន៖</p>
      <ul>
        <li>ខូគីផ្ទៀងផ្ទាត់អត្តសញ្ញាណ — រក្សាការចូលគណនីរបស់អ្នក និងសម្គាល់សម័យប្រើប្រាស់</li>
        <li>ខូគីចំណូលចិត្ត — ចងចាំការកំណត់ដូចជាតម្រងស្វែងរកអចលនទ្រព្យដែលអ្នកបានរក្សាទុក</li>
        <li>ខូគីមុខងារ — គាំទ្រមុខងារដូចជាការជូនដំណឹងកំណត់អត្រានៅពេលមានចរាចរណ៍ខ្ពស់</li>
      </ul>
      <p><strong>ខូគី និងបច្ចេកវិទ្យាស្រដៀងគ្នាដែលជាជម្រើស</strong> ត្រូវបានប្រើសម្រាប់ការផ្សាយពាណិជ្ជកម្ម ការធ្វើឱ្យសមស្របតាមចំណូលចិត្ត ការវិភាគ ឬការវាស់វែង។ បច្ចុប្បន្ន យើងមិនទាន់ប្រើប្រភេទណាមួយក្នុងចំណោមទាំងនេះទេ។ ដូចរៀបរាប់នៅផ្នែក "ការផ្សាយពាណិជ្ជកម្ម" ខាងលើ យើងមានផែនការណែនាំការផ្សាយពាណិជ្ជកម្មពីភាគីទីបី រួមទាំង Google ដែលនឹងកំណត់ខូគី ឬបច្ចេកវិទ្យាស្រដៀងគ្នាសម្រាប់គោលបំណងទាំងនេះ។ នៅពេលនោះកើតឡើង អ្នកអាចគ្រប់គ្រង ឬកំណត់ការផ្សាយពាណិជ្ជកម្មតាមចំណូលចិត្តផ្ទាល់ខ្លួនតាមរយៈការកំណត់ការផ្សាយពាណិជ្ជកម្មរបស់ Google (adssettings.google.com) និងការកំណត់ខូគីនៅក្នុងកម្មវិធីរុករករបស់អ្នក។</p>
      <p>បច្ចុប្បន្ន យើងមិនទាន់មានផ្ទាំងសម្រាប់ការយល់ព្រមលើខូគីនោះទេ។ ប្រសិនបើយើងណែនាំខូគីជម្រើសសម្រាប់ការផ្សាយពាណិជ្ជកម្ម ឬការវិភាគ យើងនឹងធ្វើបច្ចុប្បន្នភាពគោលការណ៍ភាពឯកជននេះ និងផ្តល់មធ្យោបាយគ្រប់គ្រងសមស្របស្របតាមច្បាប់ដែលអនុវត្ត។</p>

      <h2 id="children">៩. ភាពឯកជនរបស់កុមារ</h2>
      <p>SabayRent មិនត្រូវបានរចនាឡើងសម្រាប់កុមារនោះទេ ហើយយើងមិនប្រមូលទិន្នន័យពីកុមារដែលមានអាយុក្រោមអាយុតម្រូវដោយច្បាប់មូលដ្ឋានក្នុងការចូលកិច្ចសន្យាជួលដោយចេតនានោះទេ។</p>

      <h2 id="changes">១០. ការផ្លាស់ប្តូរគោលការណ៍នេះ</h2>
      <p>យើងអាចធ្វើបច្ចុប្បន្នភាពគោលការណ៍ភាពឯកជននេះ ស្របតាមការវិវត្តរបស់វេទិកា។ ការផ្លាស់ប្តូរសំខាន់ៗនឹងត្រូវឆ្លុះបញ្ចាំងនៅកាលបរិច្ឆេទ "កែប្រែចុងក្រោយ" ខាងលើ។</p>

      <h2 id="contact">១១. ទំនាក់ទំនងមកយើង</h2>
      <p>ប្រសិនបើអ្នកមានសំណួរអំពីគោលការណ៍ភាពឯកជននេះ ឬអំពីរបៀបដែលទិន្នន័យរបស់អ្នកត្រូវបានប្រើប្រាស់ សូមទាក់ទងអ្នកគ្រប់គ្រងវេទិកាតាមរយៈទម្រង់មតិកែលម្អក្នុងកម្មវិធី ឬបណ្តាញគាំទ្រដែលបានចុះនៅលើគេហទំព័រ SabayRent។</p>
    </template>

    <template v-else>
      <h1>Privacy Policy</h1>
      <span class="badge">Last updated: August 15, 2026</span>
      <p class="intro">
        This Privacy Policy explains what information SabayRent ("we", "our", "the Platform") collects from users
        ("you"), how we use it, and the choices you have. It applies to the SabayRent website, application, and
        related services.
      </p>

      <h2 id="information-we-collect">1. Information We Collect</h2>

      <h3>1.1 Account Information</h3>
      <p>When you register or sign in, we collect:</p>
      <ul>
        <li>Name, email address, and password (we store your password securely and can never access or retrieve it in plain text)</li>
        <li>Phone number(s), including whether a number is a regular phone or linked via Telegram</li>
        <li>Profile picture, if you upload one, stored on Cloudflare R2</li>
        <li>Account role (Tenant, Landlord, or Admin)</li>
        <li>Your visibility preferences — whether your phone, Telegram, or email are shown to others on your listings</li>
      </ul>
      <p>If you sign in with Google or Telegram, we receive your email and name (Google) or your Telegram user ID, name, and username (Telegram) from those providers to create or match your account. We do not receive your Google or Telegram password.</p>

      <h3>1.2 Property Listings (Landlords)</h3>
      <p>If you list a property, we collect and publish: address, approximate location (province/district, and optionally exact latitude/longitude and a location link), price, deposit, room details (bedrooms, bathrooms, size, floor), amenities, house rules, parking details, availability, and photos of the property.</p>
      <p>By publishing a listing, you authorize us to process and publicly display this content — including photos stored on Cloudflare R2 — as part of the listing service.</p>

      <h3>1.3 Usage & Activity Data</h3>
      <p>We also collect:</p>
      <ul>
        <li>Properties you favourite or save</li>
        <li>Property view counts (aggregated, not tied to your identity in reporting)</li>
        <li>Location search views — province/district search popularity, aggregated</li>
        <li>Reports you file against a listing (report type and description)</li>
        <li>Feedback or bug reports you submit</li>
        <li>Basic technical information for security purposes — such as your IP address, browser/device information, and the action taken on your account</li>
      </ul>

      <h3>1.4 Authentication Data</h3>
      <ul>
        <li>One-time passwords (OTPs) for registration and password reset, which expire after 10 minutes</li>
        <li>Session and authentication information needed to keep you signed in and help secure your account, until you log out, reset your password, or it expires automatically</li>
      </ul>

      <h2 id="how-we-use-it">2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Create and secure your account (authentication, OTP verification, password reset)</li>
        <li>Let you list, browse, search, and favourite properties</li>
        <li>Show landlords aggregate statistics about their listings (views, favourites)</li>
        <li>Notify landlords and admins when a listing is reported, and notify admins of feedback submissions</li>
        <li>Send you OTP codes by email or Telegram</li>
        <li>Detect abuse, investigate reports, and maintain platform security</li>
        <li>Enforce platform rules — such as maintenance mode or listing limits — set by administrators</li>
      </ul>
      <p>We do not sell your personal information to third parties. We do not currently use your data for third-party advertising, though we plan to introduce third-party advertising services — see the Advertising section below for details.</p>

      <h2 id="who-we-share-with">3. Who We Share Information With</h2>
      <p>We share data only as needed to operate the Platform:</p>
      <table>
        <thead>
          <tr>
            <th>Recipient</th>
            <th>What is shared</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Other users</td>
            <td>Your name, and — if you allow it — phone, Telegram username, or email, plus your published listings</td>
            <td>So tenants and landlords can contact each other</td>
          </tr>
          <tr>
            <td>Cloudflare R2</td>
            <td>Property photos and profile images</td>
            <td>Image storage and hosting</td>
          </tr>
          <tr>
            <td>Telegram</td>
            <td>Messages containing OTPs, report and feedback alerts</td>
            <td>Delivering notifications you or admins trigger</td>
          </tr>
          <tr>
            <td>Google</td>
            <td>Sign-in verification information</td>
            <td>Sign-in with Google</td>
          </tr>
          <tr>
            <td>Gmail / SMTP</td>
            <td>OTP emails, notification emails</td>
            <td>Delivering notifications by email</td>
          </tr>
          <tr>
            <td>Platform admins</td>
            <td>Reports, feedback, audit logs, account status</td>
            <td>Content moderation and platform administration</td>
          </tr>
        </tbody>
      </table>
      <p>We do not share your data with data brokers. Google's sign-in service listed above is used only for signing in with Google, and is entirely separate from Google's advertising services. If we introduce third-party advertising as described in the Advertising section below, Google and other advertising partners may receive cookies and similar technologies, along with technical information about your browser or device, for ad delivery and measurement — not your full account information.</p>

      <h2 id="retention">4. Data Retention</h2>
      <ul>
        <li>Account data is retained as long as your account is active.</li>
        <li>OTPs are deleted immediately after use, or once they expire (10 minutes).</li>
        <li>Session information is invalidated when you log out or reset your password, and expires automatically after a period of inactivity.</li>
        <li>Security and audit logs are retained only for as long as reasonably necessary for security, fraud prevention, troubleshooting, and legal obligations.</li>
      </ul>
      <p>If you delete your account, we delete or anonymize the personal information associated with it — including your phone number and session information — and your published listings and associated content may be removed. Some information may remain where reasonably necessary for security, fraud prevention, dispute resolution, or legal obligations. This process does not guarantee the immediate deletion of every record.</p>

      <h2 id="your-rights">5. Your Choices & Rights</h2>
      <ul>
        <li>Visibility controls — you can hide your phone number, Telegram, or email from your public listings at any time in your profile settings.</li>
        <li>Access and correction — you can view and update your profile information directly in the app.</li>
        <li>Account deletion — you may request deletion of your account by contacting us. We'll delete or anonymize your data as described in the Data Retention section above; this isn't always instantaneous, and some records may need to remain for security, fraud prevention, dispute resolution, or legal reasons.</li>
        <li>Session security — you can log out at any time to end your active session; resetting your password invalidates all active sessions.</li>
      </ul>

      <h2 id="security">6. Security</h2>
      <ul>
        <li>Passwords and one-time codes are protected using appropriate security measures and are never stored in plain text.</li>
        <li>We use HTTPS to encrypt data transmitted between your device and our Platform.</li>
        <li>Access to admin functions requires a verified account with the Admin role.</li>
        <li>We limit how often sensitive actions — such as signing in, registering, requesting a code, and submitting reports — can be repeated in a short time, to reduce abuse.</li>
      </ul>
      <p>No system is 100% secure, and we cannot guarantee absolute security of information transmitted to the Platform.</p>

      <h2 id="advertising">7. Advertising</h2>
      <p>SabayRent does not currently display advertisements. We plan to introduce advertising on the Platform, which may include third-party advertising services such as Google (for example, Google AdSense).</p>
      <p>Once introduced, Google and its advertising partners may use cookies and similar technologies, along with technical information about your browser or device, to deliver ads, measure ad performance, prevent fraud, and, where applicable, personalize the ads shown to you. These technologies are separate from the Google sign-in service described in the "Who We Share Information With" section above, which is used only for signing in. We do not directly use your private contact information (such as your phone number or email address) or other private account information to target advertisements to you.</p>
      <p>We will update this Privacy Policy before any advertising service goes live, and the Cookies section below explains how you may be able to manage advertising-related cookies once introduced.</p>

      <h2 id="cookies">8. Cookies and Similar Technologies</h2>
      <p><strong>Essential cookies</strong> are required for the Platform to work and cannot be disabled:</p>
      <ul>
        <li>Authentication cookies — keep you signed in and identify your session</li>
        <li>Preference cookies — remember settings such as your saved property search filters</li>
        <li>Functional cookies — support features such as rate-limit notices during periods of high activity</li>
      </ul>
      <p><strong>Optional cookies and similar technologies</strong> are used for advertising, personalization, analytics, or measurement. We do not currently use any of these. As described in the Advertising section above, we plan to introduce third-party advertising, including Google, which would set cookies or use similar technologies for these purposes. Once that happens, you may be able to manage or limit personalized advertising through Google's Ads Settings (adssettings.google.com) and through your browser's cookie controls.</p>
      <p>We do not currently operate a cookie-consent banner. If we introduce optional cookies for advertising or analytics, we will update this Privacy Policy and provide appropriate controls consistent with applicable law.</p>

      <h2 id="children">9. Children's Privacy</h2>
      <p>SabayRent is not directed at children, and we do not knowingly collect data from children under the age required by local law to enter into a rental agreement.</p>

      <h2 id="changes">10. Changes to This Policy</h2>
      <p>We may update this Privacy Policy as the Platform evolves. Material changes will be reflected in the "Last updated" date above.</p>

      <h2 id="contact">11. Contact Us</h2>
      <p>If you have questions about this Privacy Policy or how your data is handled, contact the platform administrator through the in-app feedback form or the support channel listed on the SabayRent website.</p>
    </template>
  </LegalDocument>
</template>

<script lang="ts" setup>
import LegalDocument from '~/components/legal/legal-document.vue'

const { t, locale } = useI18n()

useSeoMeta({
  title: () => `${t('footer.privacy')} | SabayRent`,
})
</script>
