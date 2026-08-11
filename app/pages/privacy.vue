<template>
  <LegalDocument>
    <template v-if="locale === 'km'">
      <h1>គោលការណ៍ភាពឯកជន</h1>
      <span class="badge">កែប្រែចុងក្រោយ៖ ថ្ងៃទី៩ ខែកក្កដា ឆ្នាំ២០២៦</span>
      <p class="intro">
        គោលការណ៍ភាពឯកជននេះ ពន្យល់ពីព័ត៌មានដែល RokPteah ("យើង") ប្រមូលពីអ្នកប្រើប្រាស់ ("អ្នក")
        របៀបដែលយើងប្រើប្រាស់ព័ត៌មាននោះ និងជម្រើសដែលអ្នកមាន។ គោលការណ៍នេះអនុវត្តលើកម្មវិធីវេប RokPteah និង API ខាងក្រោយរបស់វា។
      </p>

      <h2 id="information-we-collect">១. ព័ត៌មានដែលយើងប្រមូល</h2>

      <h3>១.១ ព័ត៌មានគណនី</h3>
      <p>នៅពេលអ្នកចុះឈ្មោះ ឬចូលគណនី យើងប្រមូល៖</p>
      <ul>
        <li>ឈ្មោះ អាសយដ្ឋានអ៊ីមែល និងពាក្យសម្ងាត់ (រក្សាទុកជា bcrypt hash — យើងមិនដែលរក្សាទុក ឬអាចទាញយកពាក្យសម្ងាត់ពិតរបស់អ្នកបានទេ)</li>
        <li>លេខទូរស័ព្ទ រួមទាំងថាតើលេខនោះជាទូរស័ព្ទធម្មតា ឬភ្ជាប់តាមរយៈ Telegram</li>
        <li>រូបភាពប្រវត្តិរូប ប្រសិនបើអ្នកបានបញ្ចូល ដែលរក្សាទុកនៅលើ Cloudflare R2</li>
        <li>តួនាទីគណនី (អ្នកជួល ម្ចាស់អចលនទ្រព្យ ឬអ្នកគ្រប់គ្រង)</li>
        <li>ចំណូលចិត្តភាពមើលឃើញរបស់អ្នក — ថាតើលេខទូរស័ព្ទ Telegram ឬអ៊ីមែលរបស់អ្នកបង្ហាញដល់អ្នកដទៃឬអត់</li>
      </ul>
      <p>ប្រសិនបើអ្នកចូលគណនីតាមរយៈ Google ឬ Telegram យើងទទួលបានអ៊ីមែល និងឈ្មោះរបស់អ្នក (Google) ឬលេខសម្គាល់អ្នកប្រើប្រាស់ ឈ្មោះ និងឈ្មោះអ្នកប្រើប្រាស់ Telegram (Telegram) ពីអ្នកផ្តល់សេវាទាំងនោះ ដើម្បីបង្កើត ឬផ្គូផ្គងគណនីរបស់អ្នក។ យើងមិនទទួលបានពាក្យសម្ងាត់ Google ឬ Telegram របស់អ្នកនោះទេ។</p>

      <h3>១.២ ការផ្សាយអចលនទ្រព្យ (ម្ចាស់អចលនទ្រព្យ)</h3>
      <p>ប្រសិនបើអ្នកផ្សាយអចលនទ្រព្យ យើងប្រមូល និងបោះផ្សាយ៖ អាសយដ្ឋាន ទីតាំងប្រហែល (ខេត្ត/ស្រុក និងជម្រើសទីតាំងជាក់លាក់ latitude/longitude ព្រមទាំងតំណភ្ជាប់ទីតាំង) តម្លៃ ប្រាក់កក់ ព័ត៌មានលម្អិតបន្ទប់ (បន្ទប់គេង បន្ទប់ទឹក ទំហំ ជាន់) សម្ភារៈបរិក្ខារ វិន័យផ្ទះ ព័ត៌មានចំណតរថយន្ត ភាពទំនេរ និងរូបភាពនៃអចលនទ្រព្យ។</p>

      <h3>១.៣ ទិន្នន័យប្រើប្រាស់ និងសកម្មភាព</h3>
      <p>យើងក៏ប្រមូលផងដែរ៖</p>
      <ul>
        <li>អចលនទ្រព្យដែលអ្នករក្សាទុកជាចំណូលចិត្ត</li>
        <li>ចំនួនចូលមើលអចលនទ្រព្យ (ជាទិន្នន័យសរុប មិនភ្ជាប់ជាមួយអត្តសញ្ញាណរបស់អ្នកនៅក្នុងរបាយការណ៍ទេ)</li>
        <li>ការស្វែងរកតាមទីតាំង — ប្រជាប្រិយភាពនៃការស្វែងរកខេត្ត/ស្រុក ជាទិន្នន័យសរុប</li>
        <li>របាយការណ៍ដែលអ្នកដាក់ប្រឆាំងនឹងការផ្សាយណាមួយ (ប្រភេទ និងការពិពណ៌នារបាយការណ៍)</li>
        <li>មតិកែលម្អ ឬរបាយការណ៍កំហុសដែលអ្នកដាក់ស្នើ</li>
        <li>ទិន្នន័យមេតារបស់សំណើជាមូលដ្ឋានសម្រាប់គោលបំណងសុវត្ថិភាព — អាសយដ្ឋាន IP ភ្នាក់ងារកម្មវិធីរុករក សកម្មភាពដែលបានធ្វើ និងលេខកូដស្ថានភាព HTTP ដែលកត់ត្រានៅក្នុងកំណត់ត្រាសវនកម្មផ្ទៃក្នុង</li>
      </ul>

      <h3>១.៤ ទិន្នន័យផ្ទៀងផ្ទាត់អត្តសញ្ញាណ</h3>
      <ul>
        <li>លេខកូដ OTP សម្រាប់ការចុះឈ្មោះ និងការកំណត់ពាក្យសម្ងាត់ឡើងវិញ — រក្សាទុកតែជា SHA-256 hash ប៉ុណ្ណោះ និងផុតកំណត់ក្នុងរយៈពេល ១០ នាទី</li>
        <li>សញ្ញាសម័យប្រើប្រាស់/refresh token (លេខសម្គាល់ចៃដន្យ មិនមែនពាក្យសម្ងាត់របស់អ្នកទេ) ប្រើដើម្បីរក្សាការចូលគណនីរបស់អ្នក មានសុពលភាពរហូតដល់ ៧ ថ្ងៃ</li>
        <li>កាលបរិច្ឆេទចូលគណនី និងទិន្នន័យផុតកំណត់សញ្ញាសម័យប្រើប្រាស់</li>
      </ul>

      <h2 id="how-we-use-it">២. របៀបដែលយើងប្រើប្រាស់ព័ត៌មានរបស់អ្នក</h2>
      <p>យើងប្រើប្រាស់ព័ត៌មានរបស់អ្នកដើម្បី៖</p>
      <ul>
        <li>បង្កើត និងធានាសុវត្ថិភាពគណនីរបស់អ្នក (ការផ្ទៀងផ្ទាត់អត្តសញ្ញាណ ការផ្ទៀងផ្ទាត់ OTP ការកំណត់ពាក្យសម្ងាត់ឡើងវិញ)</li>
        <li>អនុញ្ញាតឱ្យអ្នកផ្សាយ រុករក ស្វែងរក និងរក្សាទុកអចលនទ្រព្យជាចំណូលចិត្ត</li>
        <li>បង្ហាញស្ថិតិសរុបដល់ម្ចាស់អចលនទ្រព្យអំពីការផ្សាយរបស់ពួកគេ (ចំនួនចូលមើល ចំណូលចិត្ត)</li>
        <li>ជូនដំណឹងដល់ម្ចាស់អចលនទ្រព្យ និងអ្នកគ្រប់គ្រងនៅពេលការផ្សាយត្រូវបានរាយការណ៍ ព្រមទាំងជូនដំណឹងអ្នកគ្រប់គ្រងអំពីការដាក់ស្នើមតិកែលម្អ</li>
        <li>ផ្ញើលេខកូដ OTP ដល់អ្នកតាមអ៊ីមែល ឬ Telegram</li>
        <li>រកឃើញការកេងប្រវ័ញ្ច ស៊ើបអង្កេតរបាយការណ៍ និងរក្សាសុវត្ថិភាពវេទិកា (កំណត់ត្រាសវនកម្ម ការកំណត់អត្រា)</li>
        <li>អនុវត្តគោលការណ៍វេទិកា — ដូចជាម៉ូដថែទាំ ឬដែនកំណត់ការផ្សាយ — ដែលកំណត់ដោយអ្នកគ្រប់គ្រង</li>
      </ul>
      <p>យើងមិនលក់ព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នកទៅភាគីទីបីនោះទេ ហើយយើងក៏មិនប្រើទិន្នន័យរបស់អ្នកសម្រាប់ការផ្សាយពាណិជ្ជកម្មពីភាគីទីបីដែរ។</p>

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
            <td>Telegram (តាមរយៈ Bot API)</td>
            <td>សារដែលមានលេខកូដ OTP ការជូនដំណឹងអំពីរបាយការណ៍ និងមតិកែលម្អ</td>
            <td>ការផ្ញើការជូនដំណឹងដែលអ្នក ឬអ្នកគ្រប់គ្រងបានធ្វើឱ្យកើតឡើង</td>
          </tr>
          <tr>
            <td>Google</td>
            <td>ដំណើរការចូលគណនីតាម OAuth</td>
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
      <p>យើងមិនចែករំលែកទិន្នន័យរបស់អ្នកជាមួយអ្នកជួញដូរទិន្នន័យ ឬបណ្តាញផ្សាយពាណិជ្ជកម្មនោះទេ។</p>

      <h2 id="retention">៤. ការរក្សាទុកទិន្នន័យ</h2>
      <ul>
        <li>ទិន្នន័យគណនីត្រូវបានរក្សាទុកដរាបណាគណនីរបស់អ្នកនៅសកម្ម។</li>
        <li>លេខកូដ OTP ត្រូវបានលុបចោលភ្លាមៗបន្ទាប់ពីប្រើប្រាស់ ឬនៅពេលផុតកំណត់ (១០ នាទី)។</li>
        <li>Refresh token ត្រូវបានលុបចោលនៅពេលចាកចេញ ឬកំណត់ពាក្យសម្ងាត់ឡើងវិញ ហើយត្រូវបានលុបចោលដោយស្វ័យប្រវត្តិរៀងរាល់យប់នៅពេលផុតកំណត់។</li>
        <li>កំណត់ត្រាសវនកម្មត្រូវបានរក្សាទុកសម្រាប់គោលបំណងសុវត្ថិភាព និងការស៊ើបអង្កេតការកេងប្រវ័ញ្ច។</li>
      </ul>
      <p>ប្រសិនបើអ្នកលុបគណនីរបស់អ្នក កំណត់ត្រាផ្ទាល់ខ្លួនដែលពាក់ព័ន្ធ — ការផ្សាយ ចំណូលចិត្ត លេខទូរស័ព្ទ សញ្ញាសម័យប្រើប្រាស់ របាយការណ៍ និងមតិកែលម្អ — នឹងត្រូវលុប ឬផ្តាច់ចេញ ស្របតាមក្បួនខ្នាតទិន្នន័យនៃមូលដ្ឋានទិន្នន័យខាងក្រោយ។</p>

      <h2 id="your-rights">៥. ជម្រើស និងសិទ្ធិរបស់អ្នក</h2>
      <ul>
        <li>ការគ្រប់គ្រងភាពមើលឃើញ — អ្នកអាចលាក់លេខទូរស័ព្ទ Telegram ឬអ៊ីមែលរបស់អ្នកពីការផ្សាយសាធារណៈបានគ្រប់ពេលវេលានៅក្នុងការកំណត់ប្រវត្តិរូបរបស់អ្នក។</li>
        <li>ការចូលមើល និងកែតម្រូវ — អ្នកអាចមើល និងកែប្រែព័ត៌មានប្រវត្តិរូបរបស់អ្នកដោយផ្ទាល់នៅក្នុងកម្មវិធី។</li>
        <li>ការលុបគណនី — ទាក់ទងមកយើងដើម្បីស្នើសុំលុបគណនី និងទិន្នន័យពាក់ព័ន្ធរបស់អ្នក។</li>
        <li>សុវត្ថិភាពសម័យប្រើប្រាស់ — អ្នកអាចចាកចេញបានគ្រប់ពេលវេលា ដែលនឹងធ្វើឱ្យ refresh token កំពុងសកម្មរបស់អ្នកគ្មានសុពលភាព។ ការកំណត់ពាក្យសម្ងាត់ឡើងវិញ នឹងធ្វើឱ្យសម័យប្រើប្រាស់សកម្មទាំងអស់គ្មានសុពលភាព។</li>
      </ul>

      <h2 id="security">៦. សុវត្ថិភាព</h2>
      <ul>
        <li>ពាក្យសម្ងាត់ត្រូវបានធ្វើ hash ជាមួយ bcrypt ចំណែក OTP ត្រូវបានធ្វើ hash ជាមួយ SHA-256 និងផុតកំណត់លឿន។</li>
        <li>ចរាចរណ៍ទាំងអស់ទៅកាន់ API គួរតែកើតឡើងតាមរយៈ HTTPS ក្នុងបរិយាកាសផលិតកម្ម។</li>
        <li>ការចូលប្រើមុខងារអ្នកគ្រប់គ្រង ទាមទារគណនីដែលបានផ្ទៀងផ្ទាត់ជាមួយតួនាទីអ្នកគ្រប់គ្រង។</li>
        <li>យើងកំណត់អត្រាលើចំណុចប្រទាក់សំខាន់ៗ — ការចូលគណនី ការចុះឈ្មោះ ការស្នើសុំ OTP និងការរាយការណ៍ — ដើម្បីកាត់បន្ថយការកេងប្រវ័ញ្ច។</li>
      </ul>
      <p>គ្មានប្រព័ន្ធណាមួយមានសុវត្ថិភាព ១០០% នោះទេ ហើយយើងមិនអាចធានាសុវត្ថិភាពពេញលេញនៃព័ត៌មានដែលបញ្ជូនទៅកាន់វេទិកាបានឡើយ។</p>

      <h2 id="children">៧. ភាពឯកជនរបស់កុមារ</h2>
      <p>RokPteah មិនត្រូវបានរចនាឡើងសម្រាប់កុមារនោះទេ ហើយយើងមិនប្រមូលទិន្នន័យពីកុមារដែលមានអាយុក្រោមអាយុតម្រូវដោយច្បាប់មូលដ្ឋានក្នុងការចូលកិច្ចសន្យាជួលដោយចេតនានោះទេ។</p>

      <h2 id="changes">៨. ការផ្លាស់ប្តូរគោលការណ៍នេះ</h2>
      <p>យើងអាចធ្វើបច្ចុប្បន្នភាពគោលការណ៍ភាពឯកជននេះ ស្របតាមការវិវត្តរបស់វេទិកា។ ការផ្លាស់ប្តូរសំខាន់ៗនឹងត្រូវឆ្លុះបញ្ចាំងនៅកាលបរិច្ឆេទ "កែប្រែចុងក្រោយ" ខាងលើ។</p>

      <h2 id="contact">៩. ទំនាក់ទំនងមកយើង</h2>
      <p>ប្រសិនបើអ្នកមានសំណួរអំពីគោលការណ៍ភាពឯកជននេះ ឬអំពីរបៀបដែលទិន្នន័យរបស់អ្នកត្រូវបានប្រើប្រាស់ សូមទាក់ទងអ្នកគ្រប់គ្រងវេទិកាតាមរយៈទម្រង់មតិកែលម្អក្នុងកម្មវិធី ឬបណ្តាញគាំទ្រដែលបានចុះនៅលើគេហទំព័រ RokPteah។</p>
    </template>

    <template v-else>
      <h1>Privacy Policy</h1>
      <span class="badge">Last updated: July 9, 2026</span>
      <p class="intro">
        This Privacy Policy explains what information RokPteah ("we", "our", "the Platform") collects from users
        ("you"), how we use it, and the choices you have. It applies to the RokPteah web application and its
        backend API.
      </p>

      <h2 id="information-we-collect">1. Information We Collect</h2>

      <h3>1.1 Account Information</h3>
      <p>When you register or sign in, we collect:</p>
      <ul>
        <li>Name, email address, and password (stored as a bcrypt hash — we never store or can retrieve your plaintext password)</li>
        <li>Phone number(s), including whether a number is a regular phone or linked via Telegram</li>
        <li>Profile picture, if you upload one, stored on Cloudflare R2</li>
        <li>Account role (Tenant, Landlord, or Admin)</li>
        <li>Your visibility preferences — whether your phone, Telegram, or email are shown to others on your listings</li>
      </ul>
      <p>If you sign in with Google or Telegram, we receive your email and name (Google) or your Telegram user ID, name, and username (Telegram) from those providers to create or match your account. We do not receive your Google or Telegram password.</p>

      <h3>1.2 Property Listings (Landlords)</h3>
      <p>If you list a property, we collect and publish: address, approximate location (province/district, and optionally exact latitude/longitude and a location link), price, deposit, room details (bedrooms, bathrooms, size, floor), amenities, house rules, parking details, availability, and photos of the property.</p>

      <h3>1.3 Usage & Activity Data</h3>
      <p>We also collect:</p>
      <ul>
        <li>Properties you favourite or save</li>
        <li>Property view counts (aggregated, not tied to your identity in reporting)</li>
        <li>Location search views — province/district search popularity, aggregated</li>
        <li>Reports you file against a listing (report type and description)</li>
        <li>Feedback or bug reports you submit</li>
        <li>Basic request metadata for security purposes — IP address, user agent, the action taken, and HTTP status code, recorded in an internal audit log</li>
      </ul>

      <h3>1.4 Authentication Data</h3>
      <ul>
        <li>One-time passwords (OTPs) for registration and password reset — stored only as a SHA-256 hash, and expire after 10 minutes</li>
        <li>Session/refresh tokens (a random identifier, not your password) used to keep you signed in, valid for up to 7 days</li>
        <li>Login timestamps and token expiry data</li>
      </ul>

      <h2 id="how-we-use-it">2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Create and secure your account (authentication, OTP verification, password reset)</li>
        <li>Let you list, browse, search, and favourite properties</li>
        <li>Show landlords aggregate statistics about their listings (views, favourites)</li>
        <li>Notify landlords and admins when a listing is reported, and notify admins of feedback submissions</li>
        <li>Send you OTP codes by email or Telegram</li>
        <li>Detect abuse, investigate reports, and maintain platform security (audit logs, rate limiting)</li>
        <li>Enforce platform rules — such as maintenance mode or listing limits — set by administrators</li>
      </ul>
      <p>We do not sell your personal information to third parties, and we do not use your data for third-party advertising.</p>

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
            <td>Telegram (via Bot API)</td>
            <td>Messages containing OTPs, report and feedback alerts</td>
            <td>Delivering notifications you or admins trigger</td>
          </tr>
          <tr>
            <td>Google</td>
            <td>OAuth login handshake</td>
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
      <p>We do not share your data with data brokers or advertising networks.</p>

      <h2 id="retention">4. Data Retention</h2>
      <ul>
        <li>Account data is retained as long as your account is active.</li>
        <li>OTPs are deleted immediately after use, or once they expire (10 minutes).</li>
        <li>Refresh tokens are deleted on logout or password reset, and are automatically purged nightly once expired.</li>
        <li>Audit logs are retained for security and abuse-investigation purposes.</li>
      </ul>
      <p>If you delete your account, associated personal records — listings, favourites, phone numbers, tokens, reports, and feedback — are removed or disassociated, in line with the underlying database's cascade rules.</p>

      <h2 id="your-rights">5. Your Choices & Rights</h2>
      <ul>
        <li>Visibility controls — you can hide your phone number, Telegram, or email from your public listings at any time in your profile settings.</li>
        <li>Access and correction — you can view and update your profile information directly in the app.</li>
        <li>Account deletion — contact us to request deletion of your account and associated data.</li>
        <li>Session security — you can log out at any time, which invalidates your active refresh token; resetting your password invalidates all active sessions.</li>
      </ul>

      <h2 id="security">6. Security</h2>
      <ul>
        <li>Passwords are hashed with bcrypt; OTPs are hashed with SHA-256 and expire quickly.</li>
        <li>All traffic to the API should occur over HTTPS in production.</li>
        <li>Access to admin functions requires a verified account with the Admin role.</li>
        <li>We rate-limit sensitive endpoints — login, registration, OTP requests, and reporting — to reduce abuse.</li>
      </ul>
      <p>No system is 100% secure, and we cannot guarantee absolute security of information transmitted to the Platform.</p>

      <h2 id="children">7. Children's Privacy</h2>
      <p>RokPteah is not directed at children, and we do not knowingly collect data from children under the age required by local law to enter into a rental agreement.</p>

      <h2 id="changes">8. Changes to This Policy</h2>
      <p>We may update this Privacy Policy as the Platform evolves. Material changes will be reflected in the "Last updated" date above.</p>

      <h2 id="contact">9. Contact Us</h2>
      <p>If you have questions about this Privacy Policy or how your data is handled, contact the platform administrator through the in-app feedback form or the support channel listed on the RokPteah website.</p>
    </template>
  </LegalDocument>
</template>

<script lang="ts" setup>
import LegalDocument from '~/components/legal/legal-document.vue'

const { t, locale } = useI18n()

useSeoMeta({
  title: () => `${t('footer.privacy')} | RokPteah`,
})
</script>
