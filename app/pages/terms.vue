<template>
  <LegalDocument>
    <template v-if="locale === 'km'">
      <h1>លក្ខខណ្ឌនៃការប្រើប្រាស់</h1>
      <span class="badge">កែប្រែចុងក្រោយ៖ ថ្ងៃទី៩ ខែកក្កដា ឆ្នាំ២០២៦</span>
      <p class="intro">
        លក្ខខណ្ឌនៃការប្រើប្រាស់ ("លក្ខខណ្ឌ") នេះ គ្រប់គ្រងការប្រើប្រាស់របស់អ្នកចំពោះ RokPteah ("វេទិកា")
        ដែលជាទីផ្សារជួលអចលនទ្រព្យរបស់កម្ពុជា ដែលភ្ជាប់ទំនាក់ទំនងរវាងម្ចាស់អចលនទ្រព្យ និងអ្នកជួល។
        តាមរយៈការបង្កើតគណនី ឬការប្រើប្រាស់វេទិកានេះ អ្នកយល់ព្រមទទួលយកលក្ខខណ្ឌទាំងនេះ។
      </p>

      <h2 id="eligibility">១. លក្ខណសម្បត្តិ និងគណនី</h2>
      <ul>
        <li>អ្នកត្រូវផ្តល់ព័ត៌មានចុះឈ្មោះឱ្យបានត្រឹមត្រូវ (ឈ្មោះ អ៊ីមែល ឬលេខទូរស័ព្ទ និងពាក្យសម្ងាត់)។</li>
        <li>អ្នកទទួលខុសត្រូវក្នុងការរក្សាព័ត៌មានចូលគណនីរបស់អ្នកជាការសម្ងាត់ និងចំពោះសកម្មភាពទាំងអស់ក្រោមគណនីរបស់អ្នក។</li>
        <li>គណនីអាចបង្កើតបានតាមរយៈអ៊ីមែល និងពាក្យសម្ងាត់ ឬដោយចូលតាម Google ឬ Telegram។ គណនីថ្មីដែលចុះឈ្មោះតាម Google ឬ Telegram នឹងកំណត់ជាតួនាទីអ្នកជួលដោយស្វ័យប្រវត្តិ ហើយអាចប្តូរទៅជាម្ចាស់អចលនទ្រព្យបានក្រោយមក។</li>
        <li>យើងអាចចាក់សោ ឬផ្អាកគណនីដែលបំពានលក្ខខណ្ឌទាំងនេះ ត្រូវបានប្រើប្រាស់ក្នុងលក្ខណៈក្លែងបន្លំ ឬត្រូវបានរកឃើញថាកំពុងកេងប្រវ័ញ្ចវេទិកា — ឧទាហរណ៍ ការរាយការណ៍ច្រើនដងដោយចេតនាអាក្រក់ ការបង្កើនចំនួនចូលមើលក្លែងក្លាយ ឬការបង្ហោះការផ្សាយផ្ទុះមិនពិត។</li>
      </ul>

      <h2 id="roles">២. តួនាទីអ្នកប្រើប្រាស់</h2>
      <ul>
        <li>អ្នកជួល (User)៖ អាចរុករក ស្វែងរក និងរក្សាទុកអចលនទ្រព្យដែលចូលចិត្ត ទំនាក់ទំនងជាមួយម្ចាស់អចលនទ្រព្យ រាយការណ៍ការផ្សាយ និងផ្តល់មតិកែលម្អ។</li>
        <li>ម្ចាស់អចលនទ្រព្យ (Landlord)៖ មានសិទ្ធិដូចអ្នកជួលទាំងអស់ បូកនឹងសិទ្ធិបង្កើត កែសម្រួល បោះផ្សាយ និងគ្រប់គ្រងការផ្សាយអចលនទ្រព្យ ស្របតាមដែនកំណត់ដែលកំណត់ដោយវេទិកា (ឧទាហរណ៍ ចំនួនអចលនទ្រព្យអតិបរមា ចំនួនរូបភាពអតិបរមាក្នុងមួយអចលនទ្រព្យ តម្លៃអប្បបរមា និងអតិបរមា)។</li>
        <li>អ្នកគ្រប់គ្រង (Admin)៖ បុគ្គលិកវេទិកាដែលត្រួតពិនិត្យរបាយការណ៍ និងមតិកែលម្អ គ្រប់គ្រងទិន្នន័យយោង និងកំណត់រចនាសម្ព័ន្ធនៃវេទិកា ដូចជាម៉ូដថែទាំ ការបើក/បិទការចុះឈ្មោះ និងដែនកំណត់នៃការផ្សាយ។</li>
      </ul>

      <h2 id="listings">៣. ការផ្សាយអចលនទ្រព្យ (សម្រាប់ម្ចាស់អចលនទ្រព្យ)</h2>
      <ul>
        <li>អ្នកត្រូវមានសិទ្ធិស្របច្បាប់ក្នុងការផ្សាយ និងជួលអចលនទ្រព្យណាមួយដែលអ្នកបង្ហោះ។</li>
        <li>ការផ្សាយត្រូវមានភាពត្រឹមត្រូវ — តម្លៃ ទីតាំង ភាពទំនេរ សម្ភារៈបរិក្ខារ និងរូបភាព ត្រូវឆ្លុះបញ្ចាំងពីអចលនទ្រព្យជាក់ស្តែង។</li>
        <li>យើងមិនផ្ទៀងផ្ទាត់ភាពជាម្ចាស់នៃអចលនទ្រព្យដែលបានផ្សាយនោះទេ។ សញ្ញាសម្គាល់ការផ្ទៀងផ្ទាត់ម្ចាស់អចលនទ្រព្យ ប្រសិនបើមាន គ្រាន់តែឆ្លុះបញ្ចាំងថាអ្នកគ្រប់គ្រងបានពិនិត្យ និងអនុម័តគណនីរបស់ម្ចាស់អចលនទ្រព្យដោយផ្ទាល់ដៃប៉ុណ្ណោះ — មិនមែនមានន័យថារាល់ព័ត៌មានលម្អិតរបស់ការផ្សាយនីមួយៗត្រូវបានផ្ទៀងផ្ទាត់ដោយឯករាជ្យនោះទេ។</li>
        <li>ខ្លឹមសារផ្សាយហាមឃាត់រួមមាន ការផ្សាយក្លែងបន្លំ ស្ទួន បំភាន់ ឬរើសអើង និងអចលនទ្រព្យដែលអ្នកមិនមានសិទ្ធិយកមកជួល។</li>
        <li>យើងរក្សាសិទ្ធិក្នុងការដកចេញ ឬលុបការផ្សាយណាមួយតាមឆន្ទានុសិទ្ធិរបស់យើង រួមទាំងក្នុងករណីមានការរាយការណ៍ពីអ្នកប្រើប្រាស់។</li>
      </ul>

      <h2 id="reporting">៤. ការរាយការណ៍ និងការត្រួតពិនិត្យ</h2>
      <p>អ្នកប្រើប្រាស់ណាមួយអាចរាយការណ៍ការផ្សាយដែលពួកគេជឿថាបំពានលក្ខខណ្ឌទាំងនេះ — ឧទាហរណ៍ ការឆបោក ខ្លឹមសារមិនសមរម្យ ការផ្សាយស្ទួន ឬព័ត៌មានមិនត្រឹមត្រូវ — លើកលែងតែការផ្សាយផ្ទាល់ខ្លួនរបស់ពួកគេផ្ទាល់។</p>
      <p>ការដាក់របាយការណ៍នឹងជូនដំណឹងទៅម្ចាស់អចលនទ្រព្យ និងអ្នកគ្រប់គ្រងវេទិកា។ របាយការណ៍មិនធ្វើឱ្យការផ្សាយត្រូវលុបចេញដោយស្វ័យប្រវត្តិនោះទេ — ការសម្រេចចិត្តត្រួតពិនិត្យធ្វើឡើងដោយអ្នកគ្រប់គ្រង។</p>
      <p>ការដាក់របាយការណ៍មិនពិតដោយចេតនា ដើម្បីយាយី ឬធ្វើឱ្យអ្នកប្រើប្រាស់ផ្សេងទៀតខូចប្រយោជន៍ គឺជាការហាមឃាត់ និងអាចនាំឱ្យគណនីត្រូវបានផ្អាក។</p>

      <h2 id="feedback">៥. មតិកែលម្អ</h2>
      <p>អ្នកអាចដាក់របាយការណ៍កំហុស ឬសំណើរផ្សេងៗតាមរយៈមុខងារមតិកែលម្អ។ មតិកែលម្អត្រូវបានត្រួតពិនិត្យដោយអ្នកគ្រប់គ្រង និងអាចត្រូវបានប្រើដើម្បីកែលម្អវេទិកា។ ការដាក់មតិកែលម្អមិនធានាថានឹងមានសកម្មភាពជាក់លាក់ណាមួយត្រូវអនុវត្តទេ។</p>

      <h2 id="fees">៦. កម្រៃសេវា</h2>
      <p>វេទិកាអាចអនុវត្តអត្រាកម្រៃលើប្រតិបត្តិការ ឬការផ្សាយ ស្របតាមការកំណត់ដោយអ្នកគ្រប់គ្រង។ រចនាសម្ព័ន្ធកម្រៃណាមួយដែលចូលជាធរមាន នឹងត្រូវជូនដំណឹងទៅអ្នកប្រើប្រាស់ដែលពាក់ព័ន្ធជាមុន។</p>
      <p>RokPteah មិនមែនជាភាគីនៃកិច្ចសន្យាជួល ឬភតិសន្យារវាងម្ចាស់អចលនទ្រព្យ និងអ្នកជួលនោះទេ ហើយមិនដំណើរការការទូទាត់ថ្លៃជួលក្នុងនាមអ្នកឡើយ លុះត្រាតែមានការចែងជាក់ស្តែងផ្សេងក្នុងកម្មវិធី។</p>

      <h2 id="acceptable-use">៧. ការប្រើប្រាស់ដែលអនុញ្ញាត</h2>
      <p>អ្នកយល់ព្រមមិន៖</p>
      <ul>
        <li>គេចវេះដែនកំណត់អត្រា ទាញយកទិន្នន័យ ឬធ្វើសកម្មភាពស្វ័យប្រវត្តិលើវេទិកាដោយគ្មានការអនុញ្ញាត</li>
        <li>បង្ហោះខ្លឹមសារដែលរំលោភសិទ្ធិកម្មសិទ្ធិបញ្ញា ខុសច្បាប់ ឬរំលោភសិទ្ធិរបស់អ្នកដទៃ</li>
        <li>ព្យាយាមចូលប្រើគណនីរបស់អ្នកប្រើប្រាស់ផ្សេង ឬក្លែងបន្លំជាបុគ្គលដទៃ</li>
        <li>រំខានដល់មុខងារសុវត្ថិភាពរបស់វេទិកា ដូចជាការផ្ទៀងផ្ទាត់អត្តសញ្ញាណ ការកំណត់អត្រា ឬការត្រួតពិនិត្យខ្លឹមសារ</li>
      </ul>

      <h2 id="availability">៨. ភាពអាចប្រើប្រាស់បាន</h2>
      <p>យើងអាចដាក់វេទិកាចូលម៉ូដថែទាំនៅពេលណាមួយ ដើម្បីធ្វើបច្ចុប្បន្នភាព។ ក្នុងអំឡុងពេលថែទាំ ការចូលប្រើសម្រាប់អ្នកមិនមែនជាអ្នកគ្រប់គ្រងអាចត្រូវបានដាក់កម្រិតជាបណ្តោះអាសន្ន លើកលែងតែផ្លូវដែលត្រូវការសម្រាប់ការចូល និងបន្តសម័យប្រើប្រាស់។</p>
      <p>យើងមិនធានាថាវេទិកានឹងដំណើរការជាប់លាប់ ឬគ្មានកំហុសនោះទេ។</p>

      <h2 id="disclaimers">៩. ការមិនទទួលខុសត្រូវ និងកម្រិតនៃទំនួលខុសត្រូវ</h2>
      <p>RokPteah ផ្តល់តែសេវាកម្មផ្សាយ និងស្វែងរកអចលនទ្រព្យប៉ុណ្ណោះ។ យើងមិនត្រួតពិនិត្យ ធានា ឬធានាចំពោះស្ថានភាព ភាពស្របច្បាប់ ឬភាពត្រឹមត្រូវនៃការផ្សាយអចលនទ្រព្យណាមួយឡើយ។</p>
      <p>អ្នកប្រើប្រាស់ទទួលខុសត្រូវទាំងស្រុងក្នុងការផ្ទៀងផ្ទាត់ព័ត៌មានលម្អិតរបស់អចលនទ្រព្យ ចរចាលក្ខខណ្ឌ និងអនុវត្តកិច្ចសន្យាជួលណាមួយដោយឯករាជ្យពីវេទិកា។</p>
      <p>ក្នុងកម្រិតអតិបរមាដែលច្បាប់អនុញ្ញាត RokPteah មិនទទួលខុសត្រូវចំពោះជម្លោះ ការខូចខាត ឬការបាត់បង់ណាមួយដែលកើតចេញពីទំនាក់ទំនងរវាងម្ចាស់អចលនទ្រព្យ និងអ្នកជួល ឬពីការពឹងផ្អែកលើខ្លឹមសារនៃការផ្សាយនោះទេ។</p>

      <h2 id="termination">១០. ការបញ្ចប់សេវា</h2>
      <p>អ្នកអាចឈប់ប្រើវេទិកា និងស្នើសុំលុបគណនីនៅពេលណាមួយ។</p>
      <p>យើងអាចផ្អាក ឬបញ្ចប់គណនីដែលបំពានលក្ខខណ្ឌទាំងនេះ ដោយមាន ឬគ្មានការជូនដំណឹងជាមុន ជាពិសេសក្នុងករណីមានការក្លែងបន្លំ ការកេងប្រវ័ញ្ច ឬការបំពានគោលការណ៍ម្តងហើយម្តងទៀត។</p>

      <h2 id="changes">១១. ការផ្លាស់ប្តូរលក្ខខណ្ឌទាំងនេះ</h2>
      <p>យើងអាចធ្វើបច្ចុប្បន្នភាពលក្ខខណ្ឌទាំងនេះ ស្របតាមការវិវត្តរបស់វេទិកា។ ការបន្តប្រើប្រាស់វេទិកាបន្ទាប់ពីការផ្លាស់ប្តូរចូលជាធរមាន ចាត់ទុកថាជាការទទួលយកលក្ខខណ្ឌដែលបានកែសម្រួល។ ការផ្លាស់ប្តូរសំខាន់ៗនឹងត្រូវឆ្លុះបញ្ចាំងនៅកាលបរិច្ឆេទ "កែប្រែចុងក្រោយ" ខាងលើ។</p>

      <h2 id="governing-law">១២. ច្បាប់អនុវត្ត</h2>
      <p>លក្ខខណ្ឌទាំងនេះស្ថិតក្រោមការគ្រប់គ្រងនៃច្បាប់នៃព្រះរាជាណាចក្រកម្ពុជា ដោយមិនគិតពីគោលការណ៍ជម្លោះច្បាប់ លុះត្រាតែច្បាប់អនុវត្តតម្រូវឱ្យធ្វើផ្សេង។</p>

      <h2 id="contact">១៣. ទំនាក់ទំនង</h2>
      <p>សំណួរអំពីលក្ខខណ្ឌទាំងនេះ អាចដាក់ស្នើតាមរយៈទម្រង់មតិកែលម្អក្នុងកម្មវិធី ឬបណ្តាញគាំទ្រដែលបានចុះនៅលើគេហទំព័រ RokPteah។</p>
    </template>

    <template v-else>
      <h1>Terms of Service</h1>
      <span class="badge">Last updated: July 9, 2026</span>
      <p class="intro">
        These Terms of Service ("Terms") govern your use of RokPteah (the "Platform"), a Cambodian property rental
        marketplace connecting landlords and tenants. By creating an account or using the Platform, you agree to
        these Terms.
      </p>

      <h2 id="eligibility">1. Eligibility & Accounts</h2>
      <ul>
        <li>You must provide accurate registration information (name, email or phone, and password).</li>
        <li>You are responsible for keeping your login credentials confidential and for all activity under your account.</li>
        <li>Accounts can be created with email and password, or by signing in with Google or Telegram. New Google or Telegram sign-ups default to the Tenant role and may switch to Landlord afterward.</li>
        <li>We may lock or suspend accounts that violate these Terms, are used fraudulently, or are found abusing the Platform — for example, spamming reports, inflating view counts, or submitting false listings.</li>
      </ul>

      <h2 id="roles">2. Roles</h2>
      <ul>
        <li>Tenant (User): may browse, search, and favourite properties; contact landlords; report listings; and submit feedback.</li>
        <li>Landlord: all Tenant permissions, plus the ability to create, edit, publish, and manage property listings, subject to platform-configured limits (e.g. maximum number of properties, maximum images per property, minimum and maximum price).</li>
        <li>Admin: platform staff who moderate reports and feedback, manage reference data, and configure platform-wide settings such as maintenance mode, registration availability, and listing limits.</li>
      </ul>

      <h2 id="listings">3. Listings (Landlords)</h2>
      <ul>
        <li>You must have the legal right to list and rent out any property you post.</li>
        <li>Listings must be accurate — price, location, availability, amenities, and photos must reflect the actual property.</li>
        <li>We do not verify ownership of listed properties. Landlord verification badges, where shown, reflect only that an admin has manually reviewed and approved the landlord's account — not that every detail of every listing has been independently confirmed.</li>
        <li>Prohibited listing content includes fraudulent, duplicate, misleading, or discriminatory listings, and properties you do not have the right to rent.</li>
        <li>We reserve the right to unpublish or remove any listing at our discretion, including in response to user reports.</li>
      </ul>

      <h2 id="reporting">4. Reporting & Moderation</h2>
      <p>Any user may report a listing they believe violates these Terms — for example, a scam, inappropriate content, a duplicate listing, or incorrect information — except for their own listings.</p>
      <p>Filing a report notifies the property owner and platform admins. Reports do not automatically unpublish a listing; moderation decisions are made by admins.</p>
      <p>Submitting knowingly false reports to harass or disadvantage another user is prohibited and may result in account suspension.</p>

      <h2 id="feedback">5. Feedback</h2>
      <p>You may submit bug reports or suggestions through the feedback feature. Feedback is reviewed by admins and may be used to improve the Platform. Submitting feedback does not guarantee that any specific action will be taken.</p>

      <h2 id="fees">6. Fees</h2>
      <p>The Platform may apply a commission rate to transactions or listings, as configured by administrators. Any fee structure that comes into effect will be communicated to affected users in advance.</p>
      <p>RokPteah is not a party to any rental or lease agreement between a landlord and a tenant, and does not process rental payments on your behalf unless explicitly stated otherwise in the app.</p>

      <h2 id="acceptable-use">7. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Circumvent rate limits, scrape data, or automate interactions with the Platform without authorization</li>
        <li>Upload content that infringes intellectual property rights, is unlawful, or violates the rights of others</li>
        <li>Attempt to access another user's account or impersonate another person</li>
        <li>Interfere with platform security features such as authentication, throttling, or moderation</li>
      </ul>

      <h2 id="availability">8. Availability</h2>
      <p>We may place the Platform into maintenance mode at any time to perform updates; during maintenance, non-admin access may be temporarily restricted, with the exception of routes needed to log in and refresh sessions.</p>
      <p>We do not guarantee uninterrupted or error-free availability of the Platform.</p>

      <h2 id="disclaimers">9. Disclaimers & Limitation of Liability</h2>
      <p>RokPteah provides a listing and discovery service only. We do not inspect, guarantee, or warrant the condition, legality, or accuracy of any property listing.</p>
      <p>Users are solely responsible for verifying property details, negotiating terms, and executing any rental agreement independently of the Platform.</p>
      <p>To the maximum extent permitted by law, RokPteah is not liable for disputes, damages, or losses arising from interactions between landlords and tenants, or from reliance on listing content.</p>

      <h2 id="termination">10. Termination</h2>
      <p>You may stop using the Platform and request account deletion at any time.</p>
      <p>We may suspend or terminate accounts that violate these Terms, with or without notice, particularly in cases of fraud, abuse, or repeated policy violations.</p>

      <h2 id="changes">11. Changes to These Terms</h2>
      <p>We may update these Terms as the Platform evolves. Continued use of the Platform after changes take effect constitutes acceptance of the revised Terms. Material changes will be reflected in the "Last updated" date above.</p>

      <h2 id="governing-law">12. Governing Law</h2>
      <p>These Terms are governed by the laws of the Kingdom of Cambodia, without regard to conflict-of-law principles, unless otherwise required by applicable law.</p>

      <h2 id="contact">13. Contact</h2>
      <p>Questions about these Terms can be submitted through the in-app feedback form or the support channel listed on the RokPteah website.</p>
    </template>
  </LegalDocument>
</template>

<script lang="ts" setup>
import LegalDocument from '~/components/legal/legal-document.vue'

const { t, locale } = useI18n()

useSeoMeta({
  title: () => `${t('footer.terms')} | RokPteah`,
})
</script>
