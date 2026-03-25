# การวิเคราะห์ปัญหา PWA หน้าจอดำ (Research)

จากการวิเคราะห์ไฟล์ `public/manifest.json`, `public/index.html` และ `src/serviceWorkerRegistration.js` พบสาเหตุที่เป็นไปได้ดังนี้ครับ:

1. **ปัญหาการตั้งค่า `start_url` (สาเหตุหลักที่พบบ่อย):**
   ในไฟล์ `public/manifest.json` มีการระบุเอาไว้ว่า:
   `"start_url": "https://corp.synzofficial.com/login"`.
   การระบุเป็น Absolute URL (ใส่โดเมนเต็ม) แบบนี้ จะทำให้:
   - กรณีที่ผู้ใช้ติดตั้ง PWA นอกเหนือจาก Production (เช่น บน Staging หรือ Local) ตัว PWA จะพยายามเปิดลิงก์ Production เสมอ
   - กรณีที่ผู้ใช้เปิด PWA แบบออฟไลน์ (Offline) แล้ว Service Worker ไม่ได้แคชหน้าเว็บที่เป็น URL โดเมนเต็มตามนี้เป๊ะๆ เอาไว้ จะโหลดหน้าเว็บไม่ขึ้น ทำให้จอแสดงสี Background ซึ่งใน `manifest.json` ตั้ง `"background_color": "#461e99"` ไว้ (สีม่วงเข้มจนดูเหมือนสีดำ)

2. **ปัญหา Service Worker Caching:**
   - ระบบใช้ Default Service Worker `serviceWorkerRegistration.js` ของ Create React App ซึ่งจะทำ Cache-first 
   - หากมีการอัปเดตโค้ดแต่ Service Worker เพิ่งโหลดตัวใหม่และยังไม่ได้ Activate ทันที ผู้ใช้อาจเปิดมาเจอบั๊กเดิมที่แคชไว้ (ถ้ามี JS Error จะเกิดจอดำเพราะ React ไม่ render `<div id="root">`)

3. **ปัญหาของ Browser Router:**
   - การเปิด PWA แบบ Standalone บางครั้ง Path เริ่มต้นอาจไม่ถูกจับคู่ได้ตรงกับ Route จนเกิดโค้ดแครช 
