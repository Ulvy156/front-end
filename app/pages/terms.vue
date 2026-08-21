<template>
  <LegalDocument>
    <template v-if="locale === 'km'">
      <h1>លក្ខខណ្ឌនៃការប្រើប្រាស់</h1>
      <span class="badge">កែប្រែចុងក្រោយ៖ ថ្ងៃទី១៥ ខែសីហា ឆ្នាំ២០២៦</span>
      <p class="intro">
        លក្ខខណ្ឌនៃការប្រើប្រាស់ ("លក្ខខណ្ឌ") នេះ គ្រប់គ្រងការប្រើប្រាស់របស់អ្នកចំពោះ SabayRent ("វេទិកា")
        ដែលជាទីផ្សារជួលអចលនទ្រព្យរបស់កម្ពុជា ដែលភ្ជាប់ទំនាក់ទំនងរវាងម្ចាស់អចលនទ្រព្យ និងអ្នកជួល។
        តាមរយៈការបង្កើតគណនី ឬការប្រើប្រាស់វេទិកានេះ អ្នកយល់ព្រមទទួលយកលក្ខខណ្ឌទាំងនេះ។
        ការប្រើប្រាស់វេទិកានេះ ក៏ស្ថិតនៅក្រោម<NuxtLink to="/privacy">គោលការណ៍ភាពឯកជន</NuxtLink>របស់យើងផងដែរ
        ដែលពន្យល់ពីរបៀបយើងប្រមូល ប្រើប្រាស់ និងការពារព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក។
      </p>

      <h2 id="eligibility">១. លក្ខណសម្បត្តិ និងគណនី</h2>
      <ul>
        <li>អ្នកត្រូវផ្តល់ព័ត៌មានចុះឈ្មោះឱ្យបានត្រឹមត្រូវ (ឈ្មោះ អ៊ីមែល ឬលេខទូរស័ព្ទ និងពាក្យសម្ងាត់)។</li>
        <li>អ្នកទទួលខុសត្រូវក្នុងការរក្សាព័ត៌មានចូលគណនីរបស់អ្នកជាការសម្ងាត់ និងចំពោះសកម្មភាពទាំងអស់ក្រោមគណនីរបស់អ្នក។</li>
        <li>គណនីអាចបង្កើតបានតាមរយៈអ៊ីមែល និងពាក្យសម្ងាត់ ឬដោយចូលតាម Google ឬ Telegram។ គណនីថ្មីដែលចុះឈ្មោះតាម Google ឬ Telegram នឹងកំណត់ជាតួនាទីអ្នកជួលដោយស្វ័យប្រវត្តិ ហើយអាចប្តូរទៅជាម្ចាស់អចលនទ្រព្យបានក្រោយមក។</li>
        <li>យើងអាចចាក់សោ ឬផ្អាកគណនីដែលបំពានលក្ខខណ្ឌទាំងនេះ ត្រូវបានប្រើប្រាស់ក្នុងលក្ខណៈក្លែងបន្លំ ឬត្រូវបានរកឃើញថាកំពុងកេងប្រវ័ញ្ចវេទិកា  ឧទាហរណ៍ ការរាយការណ៍ច្រើនដងដោយចេតនាអាក្រក់ ការបង្កើនចំនួនចូលមើលក្លែងក្លាយ ឬការបង្ហោះការផ្សាយផ្ទុះមិនពិត។</li>
      </ul>

      <h2 id="roles">២. តួនាទីអ្នកប្រើប្រាស់</h2>
      <ul>
        <li>អ្នកជួល (User)៖ អាចរុករក ស្វែងរក និងរក្សាទុកអចលនទ្រព្យដែលចូលចិត្ត ទំនាក់ទំនងជាមួយម្ចាស់អចលនទ្រព្យ រាយការណ៍ការផ្សាយ និងផ្តល់មតិកែលម្អ។</li>
        <li>ម្ចាស់អចលនទ្រព្យ (Landlord)៖ មានសិទ្ធិដូចអ្នកជួលទាំងអស់ បូកនឹងសិទ្ធិបង្កើត កែសម្រួល បោះផ្សាយ និងគ្រប់គ្រងការផ្សាយអចលនទ្រព្យ ស្របតាមដែនកំណត់ដែលវេទិកាអាចកំណត់ពីមួយពេលទៅមួយពេល។</li>
        <li>អ្នកគ្រប់គ្រង (Admin)៖ បុគ្គលិកវេទិកាដែលត្រួតពិនិត្យរបាយការណ៍ និងមតិកែលម្អ គ្រប់គ្រងទិន្នន័យយោង និងកំណត់រចនាសម្ព័ន្ធនៃវេទិកា ដូចជាម៉ូដថែទាំ ការបើក/បិទការចុះឈ្មោះ និងដែនកំណត់នៃការផ្សាយ។</li>
      </ul>

      <h2 id="user-content">៣. ខ្លឹមសាររបស់អ្នកប្រើប្រាស់</h2>
      <p>
        វេទិកានេះអនុញ្ញាតឱ្យអ្នកបញ្ជូនខ្លឹមសារ រួមទាំងការផ្សាយអចលនទ្រព្យ រូបភាព ព័ត៌មានប្រវត្តិរូប មតិវាយតម្លៃ
        និងមតិកែលម្អ ព្រមទាំងរបាយការណ៍។ អ្នកនៅតែជាម្ចាស់កម្មសិទ្ធិលើខ្លឹមសារដែលអ្នកបញ្ជូន ប៉ុន្តែអ្នកផ្តល់សិទ្ធិដល់
        SabayRent ក្នុងការផ្ទុក បង្ហាញ ផលិតឡើងវិញ និងដំណើរការខ្លឹមសារនោះតាមបច្ចេកទេស (ឧទាហរណ៍ ការកែសម្រួលទំហំរូបភាព)
        តាមតម្រូវការក្នុងការដំណើរការ និងត្រួតពិនិត្យវេទិកា។
      </p>
      <p>
        អ្នកទទួលខុសត្រូវទាំងស្រុងចំពោះខ្លឹមសារដែលអ្នកបញ្ចូល ហើយត្រូវមានសិទ្ធិចាំបាច់លើខ្លឹមសារនោះ  រួមទាំងរូបភាព
        នៃអចលនទ្រព្យដែលអ្នកផ្សាយ។ យើងអាចត្រួតពិនិត្យ តម្រង់ទិស ឬលុបខ្លឹមសារដែលបំពានលក្ខខណ្ឌទាំងនេះ ឬច្បាប់ដែលអនុវត្ត
        ដោយគ្មានការជូនដំណឹងជាមុន។
      </p>

      <h2 id="listings">៤. ការផ្សាយអចលនទ្រព្យ (សម្រាប់ម្ចាស់អចលនទ្រព្យ)</h2>
      <ul>
        <li>អ្នកត្រូវមានសិទ្ធិស្របច្បាប់ក្នុងការផ្សាយ និងជួលអចលនទ្រព្យណាមួយដែលអ្នកបង្ហោះ។</li>
        <li>ការផ្សាយត្រូវមានភាពត្រឹមត្រូវ  តម្លៃ ទីតាំង ភាពទំនេរ សម្ភារៈបរិក្ខារ និងរូបភាព ត្រូវឆ្លុះបញ្ចាំងពីអចលនទ្រព្យជាក់ស្តែង។</li>
        <li>យើងមិនផ្ទៀងផ្ទាត់ភាពជាម្ចាស់នៃអចលនទ្រព្យដែលបានផ្សាយនោះទេ។ សញ្ញាសម្គាល់ការផ្ទៀងផ្ទាត់ម្ចាស់អចលនទ្រព្យ ប្រសិនបើមាន គ្រាន់តែឆ្លុះបញ្ចាំងថាអ្នកគ្រប់គ្រងបានពិនិត្យ និងអនុម័តគណនីរបស់ម្ចាស់អចលនទ្រព្យដោយផ្ទាល់ដៃប៉ុណ្ណោះ  មិនមែនមានន័យថារាល់ព័ត៌មានលម្អិតរបស់ការផ្សាយនីមួយៗត្រូវបានផ្ទៀងផ្ទាត់ដោយឯករាជ្យនោះទេ។</li>
        <li>ការប្រព្រឹត្តហាមឃាត់រួមមាន៖ អចលនទ្រព្យក្លែងក្លាយ ឬមិនមានពិត អត្តសញ្ញាណម្ចាស់អចលនទ្រព្យក្លែងបន្លំ ឬការក្លែងបន្លំជាបុគ្គល ឬអង្គភាពដទៃ តម្លៃ ភាពទំនេរ ឬសម្ភារៈបរិក្ខារដែលបំភាន់ ឬមិនត្រឹមត្រូវខ្លាំង រូបភាពដែលលួច ឬបំភាន់ ការលាក់ដោយចេតនានូវលក្ខខណ្ឌជួលសំខាន់ៗ ការផ្សាយស្ទួន ឬរើសអើង ការស្នើសុំឱ្យអ្នកប្រើប្រាស់ទូទាត់ប្រាក់ក្រៅពីការព្រមព្រៀងតាមមធ្យោបាយក្លែងបន្លំ ការបន្លំចាប់សំណុំបែបបទ ឬការឆបោកទូទាត់ប្រាក់ផ្សេងទៀត និងការផ្សាយអចលនទ្រព្យដែលអ្នកមិនមានសិទ្ធិយកមកជួល។</li>
        <li>យើងរក្សាសិទ្ធិក្នុងការដកចេញ ឬលុបការផ្សាយណាមួយតាមឆន្ទានុសិទ្ធិរបស់យើង រួមទាំងក្នុងករណីមានការរាយការណ៍ពីអ្នកប្រើប្រាស់។</li>
      </ul>

      <h2 id="reporting">៥. ការរាយការណ៍ និងការត្រួតពិនិត្យ</h2>
      <p>អ្នកប្រើប្រាស់ណាមួយអាចរាយការណ៍ការផ្សាយដែលពួកគេជឿថាបំពានលក្ខខណ្ឌទាំងនេះ  ឧទាហរណ៍ ការឆបោក ខ្លឹមសារមិនសមរម្យ ការផ្សាយស្ទួន ឬព័ត៌មានមិនត្រឹមត្រូវ  លើកលែងតែការផ្សាយផ្ទាល់ខ្លួនរបស់ពួកគេផ្ទាល់។</p>
      <p>ការដាក់របាយការណ៍នឹងជូនដំណឹងទៅម្ចាស់អចលនទ្រព្យ និងអ្នកគ្រប់គ្រងវេទិកា។ របាយការណ៍មិនធ្វើឱ្យការផ្សាយត្រូវលុបចេញដោយស្វ័យប្រវត្តិនោះទេ  ការសម្រេចចិត្តត្រួតពិនិត្យធ្វើឡើងដោយអ្នកគ្រប់គ្រង។</p>
      <p>
        តាមឆន្ទានុសិទ្ធិរបស់យើង យើងអាចស៊ើបអង្កេតការសង្ស័យថាមានការក្លែងបន្លំ ការកេងប្រវ័ញ្ច ឬការបំពានលក្ខខណ្ឌទាំងនេះ
        ដកចេញ ឬដាក់កម្រិតការផ្សាយ និងខ្លឹមសារផ្សេងទៀត ដាក់កម្រិតការចូលប្រើមុខងារមួយចំនួន និងផ្អាក ឬបញ្ចប់គណនី។
        ក្នុងករណីច្បាប់តម្រូវ យើងក៏អាចសហការជាមួយអាជ្ញាធរមានសមត្ថកិច្ច ឬអនុវត្តតាមសំណើស្របច្បាប់ផ្សេងទៀត។ យើងមិនអាចធានាថា
        នឹងរកឃើញ ឬទប់ស្កាត់រាល់ការផ្សាយក្លែងបន្លំ ឬមិនអនុលោមតាមលក្ខខណ្ឌបាននោះទេ។
      </p>
      <p>ការដាក់របាយការណ៍មិនពិតដោយចេតនា ដើម្បីយាយី ឬធ្វើឱ្យអ្នកប្រើប្រាស់ផ្សេងទៀតខូចប្រយោជន៍ គឺជាការហាមឃាត់ និងអាចនាំឱ្យគណនីត្រូវបានផ្អាក។</p>

      <h2 id="feedback">៦. មតិកែលម្អ</h2>
      <p>អ្នកអាចដាក់របាយការណ៍កំហុស ឬសំណើរផ្សេងៗតាមរយៈមុខងារមតិកែលម្អ។ មតិកែលម្អត្រូវបានត្រួតពិនិត្យដោយអ្នកគ្រប់គ្រង និងអាចត្រូវបានប្រើដើម្បីកែលម្អវេទិកា។ ការដាក់មតិកែលម្អមិនធានាថានឹងមានសកម្មភាពជាក់លាក់ណាមួយត្រូវអនុវត្តទេ។</p>

      <h2 id="fees">៧. កម្រៃសេវា</h2>
      <p>បច្ចុប្បន្ន SabayRent អាចប្រើប្រាស់បានដោយឥតគិតថ្លៃទាំងសម្រាប់អ្នកជួល និងម្ចាស់អចលនទ្រព្យ។ យើងរក្សាសិទ្ធិក្នុងការណែនាំ ឬកែប្រែកម្រៃសេវា កម្រៃជើងសារ ថ្លៃជាវ ឬកម្រៃលើការផ្សាយនាពេលអនាគត។ ប្រសិនបើយើងធ្វើដូច្នេះ យើងនឹងជូនដំណឹងទៅអ្នកប្រើប្រាស់ដែលពាក់ព័ន្ធជាមុន មុនពេលការគិតថ្លៃណាមួយចូលជាធរមាន។</p>
      <p>SabayRent មិនមែនជាភាគីនៃកិច្ចសន្យាជួល ឬភតិសន្យារវាងម្ចាស់អចលនទ្រព្យ និងអ្នកជួលនោះទេ ហើយមិនដំណើរការការទូទាត់ថ្លៃជួលក្នុងនាមអ្នកឡើយ លុះត្រាតែមានការចែងជាក់ស្តែងផ្សេងក្នុងកម្មវិធី។</p>

      <h2 id="acceptable-use">៨. ការប្រើប្រាស់ដែលអនុញ្ញាត</h2>
      <p>អ្នកយល់ព្រមមិន៖</p>
      <ul>
        <li>គេចវេះដែនកំណត់អត្រា ទាញយកទិន្នន័យ ឬធ្វើសកម្មភាពស្វ័យប្រវត្តិលើវេទិកាដោយគ្មានការអនុញ្ញាត</li>
        <li>បង្ហោះខ្លឹមសារដែលរំលោភសិទ្ធិកម្មសិទ្ធិបញ្ញា ខុសច្បាប់ ឬរំលោភសិទ្ធិរបស់អ្នកដទៃ</li>
        <li>ព្យាយាមចូលប្រើគណនីរបស់អ្នកប្រើប្រាស់ផ្សេង ឬក្លែងបន្លំជាបុគ្គល ឬអង្គភាពដទៃ</li>
        <li>រំខានដល់មុខងារសុវត្ថិភាពរបស់វេទិកា ដូចជាការផ្ទៀងផ្ទាត់អត្តសញ្ញាណ ការកំណត់អត្រា ឬការត្រួតពិនិត្យខ្លឹមសារ</li>
      </ul>

      <h2 id="availability">៩. ភាពអាចប្រើប្រាស់បាន</h2>
      <p>យើងអាចដាក់វេទិកាចូលម៉ូដថែទាំនៅពេលណាមួយ ដើម្បីធ្វើបច្ចុប្បន្នភាព។ ក្នុងអំឡុងពេលថែទាំ មុខងារមួយចំនួនអាចមិនអាចប្រើប្រាស់បានជាបណ្តោះអាសន្នសម្រាប់អ្នកមិនមែនជាអ្នកគ្រប់គ្រង។</p>
      <p>យើងមិនធានាថាវេទិកានឹងដំណើរការជាប់លាប់ ឬគ្មានកំហុសនោះទេ។</p>

      <h2 id="advertising">១០. ការផ្សាយពាណិជ្ជកម្មពីភាគីទីបី</h2>
      <p>
        SabayRent អាចបង្ហាញការផ្សាយពាណិជ្ជកម្មពីអ្នកផ្តល់សេវាផ្សាយពាណិជ្ជកម្មភាគីទីបី រួមទាំង Google។ ការផ្សាយពាណិជ្ជកម្មដែលបង្ហាញ
        អាចមានលក្ខណៈផ្ទាល់ខ្លួន ឬមិនផ្ទាល់ខ្លួន អាស្រ័យលើការកំណត់ដែលអនុវត្ត តម្រូវការនៃការយល់ព្រម និងសេវាកម្មដែលកំពុងប្រើប្រាស់។
        យើងមិនគ្រប់គ្រងខ្លឹមសារ ភាពត្រឹមត្រូវ ភាពអាចប្រើប្រាស់បាន ឬការអនុវត្តរបស់ការផ្សាយពាណិជ្ជកម្មភាគីទីបីនោះទេ ហើយការចុះទំនាក់ទំនង
        ជាមួយការផ្សាយពាណិជ្ជកម្ម ការចូលទស្សនាគេហទំព័ររបស់អ្នកផ្សាយពាណិជ្ជកម្ម ឬការទិញផលិតផល/សេវាកម្មពីអ្នកផ្សាយពាណិជ្ជកម្ម គឺជា
        កិច្ចការរវាងអ្នក និងអ្នកផ្សាយពាណិជ្ជកម្មនោះផ្ទាល់។ អ្នកផ្តល់សេវាផ្សាយពាណិជ្ជកម្មភាគីទីបីអាចមានលក្ខខណ្ឌប្រើប្រាស់ និងគោលការណ៍
        ភាពឯកជនផ្ទាល់ខ្លួនរបស់ពួកគេ។ សូមមើល<NuxtLink to="/privacy">គោលការណ៍ភាពឯកជន</NuxtLink>របស់យើង សម្រាប់ព័ត៌មានលម្អិត
        អំពីខូគី និងបច្ចេកវិទ្យាផ្សាយពាណិជ្ជកម្ម។
      </p>

      <h2 id="disclaimers">១១. ការមិនទទួលខុសត្រូវ និងកម្រិតនៃទំនួលខុសត្រូវ</h2>
      <p>
        SabayRent ដំណើរការជាទីផ្សារជួលអចលនទ្រព្យ ដែលជួយម្ចាស់អចលនទ្រព្យ និងអ្នកជួលក្នុងការស្វែងរកអចលនទ្រព្យ និងទំនាក់ទំនងគ្នា។
        យើងមិនធានាថាអចលនទ្រព្យដែលបានផ្សាយពិតជាមាន ឬកំពុងទំនេរ ថាការផ្សាយមានភាពត្រឹមត្រូវ ឬពេញលេញ ឬថាបុគ្គលដែលផ្សាយអចលនទ្រព្យ
        មានភាពជាម្ចាស់ស្របច្បាប់ ឬមានសិទ្ធិយកអចលនទ្រព្យនោះមកជួលនោះទេ។ SabayRent មិនដើរតួជាម្ចាស់អចលនទ្រព្យ អ្នកជួល ភ្នាក់ងារ
        ឈ្មួញកណ្តាល ឬភាគីនៃកិច្ចសន្យាជួលណាមួយឡើយ លុះត្រាតែយើងបញ្ជាក់ជាក់ស្តែងផ្សេង។
      </p>
      <p>
        អ្នកប្រើប្រាស់ទទួលខុសត្រូវទាំងស្រុងក្នុងការធ្វើការត្រួតពិនិត្យដោយខ្លួនឯង ការផ្ទៀងផ្ទាត់ព័ត៌មានលម្អិតរបស់អចលនទ្រព្យ និងភាគីម្ខាងទៀត
        ការចរចាលក្ខខណ្ឌ និងការអនុវត្តកិច្ចសន្យាជួលណាមួយដោយឯករាជ្យពីវេទិកា។ SabayRent មិនធានាចំពោះអត្តសញ្ញាណ ភាពជឿទុកចិត្តផ្នែកហិរញ្ញវត្ថុ
        ឬការអនុវត្តកិច្ចសន្យារបស់ម្ចាស់អចលនទ្រព្យ ឬអ្នកជួលណាមួយឡើយ។
      </p>
      <p>ក្នុងកម្រិតអតិបរមាដែលច្បាប់អនុញ្ញាត SabayRent មិនទទួលខុសត្រូវចំពោះជម្លោះ ការខូចខាត ឬការបាត់បង់ណាមួយដែលកើតចេញពីទំនាក់ទំនងរវាងម្ចាស់អចលនទ្រព្យ និងអ្នកជួល ឬពីការពឹងផ្អែកលើខ្លឹមសារនៃការផ្សាយនោះទេ។</p>

      <h2 id="termination">១២. ការបញ្ចប់សេវា</h2>
      <p>
        អ្នកអាចឈប់ប្រើវេទិកា និងស្នើសុំលុបគណនីនៅពេលណាមួយ។ នៅពេលគណនីរបស់អ្នកត្រូវបានលុប ឬផ្អាក ការផ្សាយរបស់អ្នកនឹងត្រូវដកចេញ
        ឬលុបពីការបង្ហាញជាសាធារណៈ ការចូលប្រើមុខងារគណនីរបស់អ្នកនឹងឈប់ដំណើរការ ហើយទិន្នន័យផ្ទាល់ខ្លួនរបស់អ្នក  រួមទាំង
        ព័ត៌មានប្រវត្តិរូប ចំណូលចិត្ត ព័ត៌មានទំនាក់ទំនង របាយការណ៍ និងមតិកែលម្អ  នឹងត្រូវលុប ឬផ្តាច់ចេញពីអត្តសញ្ញាណរបស់អ្នក
        ដូចមានរៀបរាប់នៅក្នុងគោលការណ៍ភាពឯកជនរបស់យើង។ ព័ត៌មានមួយចំនួនអាចនៅតែត្រូវរក្សាទុក ក្នុងករណីចាំបាច់សមហេតុផលសម្រាប់
        គោលបំណងផ្លូវច្បាប់ សុវត្ថិភាព ការទប់ស្កាត់ការកេងប្រវ័ញ្ច ការដោះស្រាយវិវាទ ឬគោលបំណងអាជីវកម្មស្របច្បាប់ផ្សេងទៀត តាមការអនុញ្ញាតរបស់ច្បាប់។
      </p>
      <p>យើងអាចផ្អាក ឬបញ្ចប់គណនីដែលបំពានលក្ខខណ្ឌទាំងនេះ ដោយមាន ឬគ្មានការជូនដំណឹងជាមុន ជាពិសេសក្នុងករណីមានការក្លែងបន្លំ ការកេងប្រវ័ញ្ច ឬការបំពានគោលការណ៍ម្តងហើយម្តងទៀត។</p>

      <h2 id="changes">១៣. ការផ្លាស់ប្តូរលក្ខខណ្ឌទាំងនេះ</h2>
      <p>យើងអាចធ្វើបច្ចុប្បន្នភាពលក្ខខណ្ឌទាំងនេះ ស្របតាមការវិវត្តរបស់វេទិកា។ ការបន្តប្រើប្រាស់វេទិកាបន្ទាប់ពីការផ្លាស់ប្តូរចូលជាធរមាន ចាត់ទុកថាជាការទទួលយកលក្ខខណ្ឌដែលបានកែសម្រួល។ ការផ្លាស់ប្តូរសំខាន់ៗនឹងត្រូវឆ្លុះបញ្ចាំងនៅកាលបរិច្ឆេទ "កែប្រែចុងក្រោយ" ខាងលើ។</p>

      <h2 id="governing-law">១៤. ច្បាប់អនុវត្ត</h2>
      <p>លក្ខខណ្ឌទាំងនេះស្ថិតក្រោមការគ្រប់គ្រងនៃច្បាប់នៃព្រះរាជាណាចក្រកម្ពុជា ដោយមិនគិតពីគោលការណ៍ជម្លោះច្បាប់ លុះត្រាតែច្បាប់អនុវត្តតម្រូវឱ្យធ្វើផ្សេង។</p>

      <h2 id="contact">១៥. ទំនាក់ទំនង</h2>
      <p>សំណួរអំពីលក្ខខណ្ឌទាំងនេះ អាចដាក់ស្នើតាមរយៈទម្រង់មតិកែលម្អក្នុងកម្មវិធី ឬបណ្តាញគាំទ្រដែលបានចុះនៅលើគេហទំព័រ SabayRent។</p>
    </template>

    <template v-else>
      <h1>Terms of Service</h1>
      <span class="badge">Last updated: August 15, 2026</span>
      <p class="intro">
        These Terms of Service ("Terms") govern your use of SabayRent (the "Platform"), a Cambodian property rental
        marketplace connecting landlords and tenants. By creating an account or using the Platform, you agree to
        these Terms. Your use of the Platform is also subject to our
        <NuxtLink to="/privacy">Privacy Policy</NuxtLink>, which explains how we collect, use, and protect your
        personal information.
      </p>

      <h2 id="eligibility">1. Eligibility & Accounts</h2>
      <ul>
        <li>You must provide accurate registration information (name, email or phone, and password).</li>
        <li>You are responsible for keeping your login credentials confidential and for all activity under your account.</li>
        <li>Accounts can be created with email and password, or by signing in with Google or Telegram. New Google or Telegram sign-ups default to the Tenant role and may switch to Landlord afterward.</li>
        <li>We may lock or suspend accounts that violate these Terms, are used fraudulently, or are found abusing the Platform  for example, spamming reports, inflating view counts, or submitting false listings.</li>
      </ul>

      <h2 id="roles">2. Roles</h2>
      <ul>
        <li>Tenant (User): may browse, search, and favourite properties; contact landlords; report listings; and submit feedback.</li>
        <li>Landlord: all Tenant permissions, plus the ability to create, edit, publish, and manage property listings, subject to limits the Platform may set on listings from time to time.</li>
        <li>Admin: platform staff who moderate reports and feedback, manage reference data, and configure platform-wide settings such as maintenance mode, registration availability, and listing limits.</li>
      </ul>

      <h2 id="user-content">3. User Content</h2>
      <p>
        The Platform lets you submit content, including property listings, photos, profile information, reviews and
        feedback, and reports. You retain ownership of the content you submit, but you grant SabayRent a licence to
        host, display, reproduce, and technically process that content (for example, resizing images) as needed to
        operate and moderate the Platform.
      </p>
      <p>
        You are solely responsible for the content you upload and must have the necessary rights to it  including
        any photos of a property you list. We may review, moderate, or remove content that violates these Terms or
        applicable law, without prior notice.
      </p>

      <h2 id="listings">4. Listings (Landlords)</h2>
      <ul>
        <li>You must have the legal right to list and rent out any property you post.</li>
        <li>Listings must be accurate  price, location, availability, amenities, and photos must reflect the actual property.</li>
        <li>We do not verify ownership of listed properties. Landlord verification badges, where shown, reflect only that an admin has manually reviewed and approved the landlord's account  not that every detail of every listing has been independently confirmed.</li>
        <li>Prohibited conduct includes: fake or non-existent properties; false landlord identities or impersonating another person or organization; misleading or materially inaccurate prices, availability, or amenities; stolen or misleading photos; intentionally hiding important rental conditions; duplicate or discriminatory listings; asking users to pay outside agreed arrangements through fraudulent means; phishing or other payment scams; and listing properties you do not have the right to rent.</li>
        <li>We reserve the right to unpublish or remove any listing at our discretion, including in response to user reports.</li>
      </ul>

      <h2 id="reporting">5. Reporting & Moderation</h2>
      <p>Any user may report a listing they believe violates these Terms  for example, a scam, inappropriate content, a duplicate listing, or incorrect information  except for their own listings.</p>
      <p>Filing a report notifies the property owner and platform admins. Reports do not automatically unpublish a listing; moderation decisions are made by admins.</p>
      <p>
        At our discretion, we may investigate suspected fraud, abuse, or violations of these Terms; remove or
        restrict listings and other content; restrict access to certain features; and suspend or terminate accounts.
        Where legally required, we may also cooperate with law enforcement or other lawful requests from
        authorities. We cannot guarantee that we will detect or prevent every fraudulent or non-compliant listing.
      </p>
      <p>Submitting knowingly false reports to harass or disadvantage another user is prohibited and may result in account suspension.</p>

      <h2 id="feedback">6. Feedback</h2>
      <p>You may submit bug reports or suggestions through the feedback feature. Feedback is reviewed by admins and may be used to improve the Platform. Submitting feedback does not guarantee that any specific action will be taken.</p>

      <h2 id="fees">7. Fees</h2>
      <p>SabayRent is currently free to use for both tenants and landlords. We reserve the right to introduce or change fees, commissions, subscription charges, or listing fees in the future; if we do, we will give affected users reasonable advance notice before any charges take effect.</p>
      <p>SabayRent is not a party to any rental or lease agreement between a landlord and a tenant, and does not process rental payments on your behalf unless explicitly stated otherwise in the app.</p>

      <h2 id="acceptable-use">8. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Circumvent rate limits, scrape data, or automate interactions with the Platform without authorization</li>
        <li>Upload content that infringes intellectual property rights, is unlawful, or violates the rights of others</li>
        <li>Attempt to access another user's account or impersonate another person or organization</li>
        <li>Interfere with platform security features such as authentication, throttling, or moderation</li>
      </ul>

      <h2 id="availability">9. Availability</h2>
      <p>We may place the Platform into maintenance mode at any time to perform updates. During maintenance, some features may be temporarily unavailable to non-admin users.</p>
      <p>We do not guarantee uninterrupted or error-free availability of the Platform.</p>

      <h2 id="advertising">10. Third-Party Advertising</h2>
      <p>
        SabayRent may display advertisements from third-party advertising providers, including Google. Where shown,
        advertisements may be personalized or non-personalized depending on applicable settings, consent
        requirements, and the services in use. We do not control the content, accuracy, availability, or practices
        of any third-party advertisement, and interacting with an advertisement, visiting an advertiser's website,
        or purchasing a product or service from an advertiser is solely between you and that advertiser.
        Third-party advertising providers may have their own terms of service and privacy policies. See our
        <NuxtLink to="/privacy">Privacy Policy</NuxtLink> for details on cookies and advertising technologies.
      </p>

      <h2 id="disclaimers">11. Disclaimers & Limitation of Liability</h2>
      <p>
        SabayRent operates a rental marketplace that helps owners and renters discover properties and communicate
        with each other. We do not guarantee that a listed property exists or is currently available, that a
        listing is accurate or complete, or that the person listing a property has legal ownership of or authority
        to rent it. SabayRent does not act as a landlord, tenant, agent, broker, or party to any rental agreement,
        unless we explicitly state otherwise.
      </p>
      <p>
        Users are solely responsible for conducting their own due diligence, verifying property and counterparty
        details, negotiating terms, and executing any rental agreement independently of the Platform. SabayRent does
        not guarantee the identity, financial reliability, or contractual performance of any owner or renter.
      </p>
      <p>To the maximum extent permitted by law, SabayRent is not liable for disputes, damages, or losses arising from interactions between landlords and tenants, or from reliance on listing content.</p>

      <h2 id="termination">12. Termination</h2>
      <p>
        You may stop using the Platform and request account deletion at any time. When your account is deleted or
        suspended, your listings are unpublished or removed, your access to account features stops, and your
        personal data  including profile information, favourites, contact details, reports, and feedback  is
        deleted or disassociated from your identity, as described in our Privacy Policy. Certain information may be
        retained where reasonably necessary for legal, security, fraud-prevention, dispute-resolution, or other
        legitimate business purposes, as permitted by law.
      </p>
      <p>We may suspend or terminate accounts that violate these Terms, with or without notice, particularly in cases of fraud, abuse, or repeated policy violations.</p>

      <h2 id="changes">13. Changes to These Terms</h2>
      <p>We may update these Terms as the Platform evolves. Continued use of the Platform after changes take effect constitutes acceptance of the revised Terms. Material changes will be reflected in the "Last updated" date above.</p>

      <h2 id="governing-law">14. Governing Law</h2>
      <p>These Terms are governed by the laws of the Kingdom of Cambodia, without regard to conflict-of-law principles, unless otherwise required by applicable law.</p>

      <h2 id="contact">15. Contact</h2>
      <p>Questions about these Terms can be submitted through the in-app feedback form or the support channel listed on the SabayRent website.</p>
    </template>
  </LegalDocument>
</template>

<script lang="ts" setup>
import LegalDocument from '~/components/legal/legal-document.vue'

const { t, locale } = useI18n()

useSeoMeta({
  title: () => `${t('footer.terms')} | SabayRent`,
})
</script>
