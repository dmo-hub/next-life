window.DEMO_EVENTS = (window.DEMO_EVENTS || []).concat([
 {
  "id": "E2-ง",
  "title": "บอกคนที่บ้านดีไหม",
  "ageMin": 13,
  "ageMax": 17,
  "kind": "scheduled",
  "weight": 1,
  "repeatable": true,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [
    "cadet_family_told",
    "cadet_family_secret"
   ],
   "family": null,
   "poor": null,
   "noParents": true
  },
  "variantOf": "E2",
  "replaces": null,
  "text": "{ชื่อ} ตั้งใจจะสอบเข้าโรงเรียนเตรียมทหาร แต่ยังไม่ได้บอกผู้ใหญ่ที่เลี้ยงมาตั้งแต่เล็ก ถ้าสอบติด ต้องไปอยู่โรงเรียนประจำตั้งแต่อายุ 16 บ้านจะเหลือคนน้อยลงอีก เย็นนี้{ผู้ใหญ่}นั่งพับผ้าอยู่หน้าทีวี",
  "options": [
   {
    "label": "บอกตรง ๆ ว่าอยากสอบ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_told"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "{ผู้ใหญ่}วางผ้าลง แล้วบอกว่า 'เงินที่เก็บไว้น่ะ เอาไปจ่ายค่าติวเลย ไม่ต้องเกรงใจ{ถิ่น}'",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 2,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "cadet_family_support"
      ]
     },
     {
      "p": 0.5,
      "result": "{ผู้ใหญ่}ไม่ห้าม แต่บอกตรง ๆ ว่า 'อยากสอบก็สอบไป แต่ค่าติวบ้านเราไม่มีให้นะ{ถิ่น}'",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -1,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "ไปขอญาติช่วยเรื่องค่าติว",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 1,
     "money": 0
    },
    "setFlags": [
     "cadet_family_told"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "ญาติหลายบ้านช่วยกันออกค่าติวให้ ขอแค่สัญญาว่าจะตั้งใจเรียน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "cadet_family_support"
      ]
     },
     {
      "p": 0.5,
      "result": "ญาติช่วยแนะนำได้ แต่บอกว่าเรื่องค่าติวต้องหาเอง",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "บอก แต่ขอหาค่าติวเอง",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_told"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "{ผู้ใหญ่}พยักหน้า 'ก็ลองดู ไม่ไหวเมื่อไหร่ค่อยว่ากันใหม่{ถิ่น}'",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ยังไม่บอก ไม่อยากเป็นภาระ",
    "hint": "ค่าใช้จ่ายต้องหาเอง",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": -1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_secret"
    ],
    "clearFlags": [],
    "schedule": [
     {
      "id": "E2R",
      "afterYears": 1
     }
    ],
    "result": "บอกว่าตื่นไปวิ่งเพราะอยากแข็งแรง แล้วแอบซ่อนหนังสือข้อสอบเก่าไว้ใต้ที่นอน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ไม่สอบแล้ว อยู่ช่วยดูบ้าน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -2,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_let_go"
    ],
    "clearFlags": [
     "cadet_dream"
    ],
    "schedule": [],
    "result": "{ชื่อ} เก็บใบสมัครเข้าลิ้นชัก ไม่มีใครในบ้านรู้ว่าเคยคิดจะสอบ",
    "outcomes": null,
    "next": "STOP"
   }
  ]
 },
 {
  "id": "E2-ค",
  "title": "เรียนฟรี แต่ค่าติวไม่ฟรี",
  "ageMin": 13,
  "ageMax": 17,
  "kind": "scheduled",
  "weight": 1,
  "repeatable": true,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [
    "cadet_family_told",
    "cadet_family_secret"
   ],
   "family": null,
   "poor": true
  },
  "variantOf": "E2",
  "replaces": null,
  "text": "{ชื่อ} อยากสอบเข้าโรงเรียนเตรียมทหาร ถ้าสอบติดก็เรียนฟรี แต่ก่อนสอบต้องมีค่าติว ค่าสมัคร และค่ารถเข้าเมือง {เงินไม่พอ}",
  "options": [
   {
    "label": "บอกที่บ้านตรง ๆ ว่าอยากสอบ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_told"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.75,
      "result": "ที่บ้านไม่ห้าม แต่ไม่มีเงินค่าติวให้ {ผู้ใหญ่}ไปขอยืมข้อสอบเก่าจากบ้านข้าง ๆ มาให้อ่าน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 2,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.25,
      "result": "ญาติหลายบ้านรู้ข่าว ช่วยกันลงขันใส่ซองมาเป็นค่าติวให้",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 1,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "cadet_family_support"
      ]
     }
    ],
    "next": null
   },
   {
    "label": "บอกที่บ้าน แต่จะอ่านเองไม่ติว",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_told"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "{ผู้ใหญ่}โล่งใจ บอกว่า 'อ่านเองได้ก็ดีเลย ประหยัดไปเยอะ{ถิ่น}'",
    "outcomes": null,
    "next": null
   },
   {
    "label": "บอก แล้วรับจ้างหาค่าสมัครเอง",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 1
    },
    "setFlags": [
     "cadet_family_told"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "หลังเลิกเรียนไปรับจ้าง ค่าแรงแยกใส่กระป๋องไว้ เขียนว่า 'ค่าสมัครสอบ'",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ยังไม่บอก ไม่อยากให้ที่บ้านกังวล",
    "hint": "ค่าใช้จ่ายต้องหาเอง",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": -1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_secret"
    ],
    "clearFlags": [],
    "schedule": [
     {
      "id": "E2R",
      "afterYears": 1
     }
    ],
    "result": "ไม่พูดเรื่องนี้กับใคร แอบซ่อนหนังสือข้อสอบเก่าไว้ใต้ที่นอน อ่านจนดึกทุกคืน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "เลิกคิด ช่วยงานที่บ้านดีกว่า",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -2,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_let_go"
    ],
    "clearFlags": [
     "cadet_dream"
    ],
    "schedule": [],
    "result": "{ชื่อ} พับใบรับสมัครเก็บในกระเป๋านักเรียน แล้วไม่พูดถึงอีก",
    "outcomes": null,
    "next": "STOP"
   }
  ]
 },
 {
  "id": "E2-ก",
  "title": "จะบอกแม่ดีไหม",
  "ageMin": 13,
  "ageMax": 17,
  "kind": "scheduled",
  "weight": 1,
  "repeatable": true,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [
    "cadet_family_told",
    "cadet_family_secret"
   ],
   "family": "mother",
   "poor": false
  },
  "variantOf": "E2",
  "replaces": null,
  "text": "{ชื่อ} ตั้งใจจะสอบเข้าโรงเรียนเตรียมทหาร แต่ยังไม่ได้บอกใคร มื้อเย็นวันนี้แม่ถามว่า 'ช่วงนี้ตื่นไปวิ่งตั้งแต่ไก่โห่ทุกวันเลยนะ มีอะไรจะบอกแม่ไหมเนี่ย' ถ้าสอบติด ต้องไปอยู่โรงเรียนประจำตั้งแต่อายุ 16 และก่อนสอบก็ต้องมีค่าติว",
  "options": [
   {
    "label": "บอกแม่ตรง ๆ ว่าอยากสอบ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_told"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.6,
      "result": "แม่เงียบไปพักหนึ่ง แล้วบอกว่า 'ค่าติวเท่าไหร่ล่ะ เดี๋ยวแม่หาให้{ถิ่น}'",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 1,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "cadet_family_support"
      ]
     },
     {
      "p": 0.4,
      "result": "แม่ไม่ห้าม แต่ห่วงที่ลูกต้องไปอยู่ไกลบ้าน เรื่องค่าติวขอคิดดูก่อน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "ชวนแม่ไปฟังรุ่นพี่ที่สอบติด",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_told"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "ฟังรุ่นพี่เล่าจบ แม่หายห่วงไปเยอะ กลับถึงบ้านก็ยื่นซองค่าติวให้",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 2,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "cadet_family_support"
      ]
     },
     {
      "p": 0.5,
      "result": "ฟังจบแม่ยิ่งเป็นห่วง ขอให้คิดให้ดีก่อนสมัคร ยังไม่รับปากเรื่องค่าติว",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "บอกแม่ แต่ขอหาค่าติวเอง",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_told"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "แม่ไม่ห้าม บอกว่า 'เอาเลยลูก เงินขาดเท่าไหร่ก็บอกแม่{ถิ่น}'",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ยังไม่บอก แอบเตรียมตัวเอง",
    "hint": "ค่าใช้จ่ายต้องหาเอง",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": -1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_secret"
    ],
    "clearFlags": [],
    "schedule": [
     {
      "id": "E2R",
      "afterYears": 1
     }
    ],
    "result": "ตอบแม่ว่าวิ่งออกกำลังเฉย ๆ แล้วแอบซ่อนหนังสือข้อสอบเก่าไว้ใต้ที่นอน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "เลิกคิดเรื่องสอบเตรียมทหาร",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -2,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_let_go"
    ],
    "clearFlags": [
     "cadet_dream"
    ],
    "schedule": [],
    "result": "{ชื่อ} เก็บใบสมัครเข้าลิ้นชัก แม่ไม่เคยรู้เรื่องนี้เลย",
    "outcomes": null,
    "next": "STOP"
   }
  ]
 },
 {
  "id": "E2-ข",
  "title": "จะบอกพ่อดีไหม",
  "ageMin": 13,
  "ageMax": 17,
  "kind": "scheduled",
  "weight": 1,
  "repeatable": true,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [
    "cadet_family_told",
    "cadet_family_secret"
   ],
   "family": "fatherOnly",
   "poor": false
  },
  "variantOf": "E2",
  "replaces": null,
  "text": "{ชื่อ} อยู่กับพ่อสองคน ตั้งใจจะสอบเข้าโรงเรียนเตรียมทหารแต่ยังไม่ได้บอก คืนนี้ช่วยพ่อซ่อมพัดลมอยู่หน้าบ้าน พ่อถามขึ้นมาว่า 'ไฟห้องเปิดถึงตีหนึ่งทุกคืนเลยนะ มีอะไรรึเปล่า' ถ้าสอบติด ต้องไปอยู่โรงเรียนประจำ ทิ้งพ่อไว้คนเดียว",
  "options": [
   {
    "label": "บอกพ่อตรง ๆ ว่าอยากสอบ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_told"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.6,
      "result": "พ่อวางไขควงแล้วบอกว่า 'ค่าติวพ่อจัดการเอง พรุ่งนี้ตีห้าตื่นไปวิ่งกับพ่อ{ถิ่น}'",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 1,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "cadet_family_support"
      ]
     },
     {
      "p": 0.4,
      "result": "พ่อถามว่า 'รู้ใช่มั้ยว่าเข้าไปแล้วมันหนัก ไม่ใช่เล่น ๆ นะ{ถิ่น}' แล้วก็เงียบไป ไม่พูดเรื่องค่าติวเลย",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "ชวนพ่อไปดูสนามสอบด้วยกัน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_told"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "เสาร์นั้นพ่อพาไปดูสนามสอบ ขากลับแวะถามราคาค่ายติว แล้วบอกว่าจะออกให้",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 2,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "cadet_family_support"
      ]
     },
     {
      "p": 0.5,
      "result": "พ่อรับปาก แต่ติดงานทุกเสาร์จนเรื่องเงียบไปเอง ค่าติวก็ไม่ได้คุยกันอีก",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "บอกพ่อ แต่ขอหาค่าติวเอง",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_told"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "พ่อพยักหน้า 'โตแล้ว เลือกเองได้ ขาดอะไรก็บอกพ่อแล้วกัน{ถิ่น}'",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ยังไม่บอก แอบเตรียมตัวเอง",
    "hint": "ค่าใช้จ่ายต้องหาเอง",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": -1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_secret"
    ],
    "clearFlags": [],
    "schedule": [
     {
      "id": "E2R",
      "afterYears": 1
     }
    ],
    "result": "ตอบพ่อว่าไม่มีอะไร แล้วแอบซ่อนหนังสือข้อสอบเก่าไว้ใต้ที่นอน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ไม่สอบแล้ว อยู่กับพ่อดีกว่า",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -2,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_let_go"
    ],
    "clearFlags": [
     "cadet_dream"
    ],
    "schedule": [],
    "result": "{ชื่อ} เก็บใบสมัครเข้าลิ้นชัก พ่อไม่เคยรู้ว่าลูกเคยคิดจะสอบ",
    "outcomes": null,
    "next": "STOP"
   }
  ]
 },
 {
  "id": "E3",
  "title": "ใบปลิวเต็มบอร์ด",
  "ageMin": 14,
  "ageMax": 17,
  "kind": "scheduled",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "ใบปลิวค่ายติวเตรียมทหารติดเต็มบอร์ดหน้าโรงเรียน 'กินนอนในค่ายทั้งปิดเทอม เช้าติวเลข เย็นวิ่ง' ราคาไม่ใช่น้อย มุมล่างของบอร์ดมีกระดาษแผ่นเล็กลายมือหวัด ๆ 'หาเพื่อนติวเตรียมทหาร ห้องสาม'",
  "options": [
   {
    "label": "เข้าค่ายติว ที่บ้านออกให้",
    "hint": "ห่างบ้านทั้งปิดเทอม",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 2,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_prep_camp"
    ],
    "clearFlags": [],
    "schedule": [
     {
      "id": "D1",
      "afterYears": 1
     }
    ],
    "result": "ทั้งบ้านมาส่งถึงหน้าค่าย ห้องติวแถวหน้ามีเด็กที่ครูพิเศษประกบทุกคาบ ใคร ๆ เรียกเขาว่าลูกนายพล",
    "outcomes": null,
    "next": null,
    "requiresFlags": [
     "cadet_family_support"
    ],
    "lockReason": "ที่บ้านยังไม่ได้รับปากเรื่องค่าติว"
   },
   {
    "label": "เข้าค่ายติว ใช้เงินเก็บตัวเอง",
    "requires": {
     "flagsNot": [
      "cadet_family_secret"
     ]
    },
    "lockReason": "ต้องให้ที่บ้านเซ็นยินยอม",
    "hint": "ค่าค่าย · ค่าที่พัก · ห่างบ้านทั้งปิดเทอม",
    "requiresMoney": 3,
    "fx": {
     "knowledge": 2,
     "health": 0,
     "happiness": 0,
     "relations": -1,
     "network": 0,
     "money": -3
    },
    "setFlags": [
     "cadet_prep_camp"
    ],
    "clearFlags": [],
    "schedule": [
     {
      "id": "D1",
      "afterYears": 1
     }
    ],
    "result": null,
    "outcomes": [
     {
      "p": 1,
      "whenFlag": "cadet_family_secret",
      "result": "บอกที่บ้านว่าไปช่วยงานญาติทั้งปิดเทอม ห้องติวแน่นจนต้องนั่งพื้น แถวหน้ามีลูกนายพลที่ครูพิเศษประกบทุกคาบ",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 1,
      "whenNotFlag": "cadet_family_secret",
      "result": "ห้องติวแน่นจนต้องนั่งพื้น แถวหน้ามีเด็กคนหนึ่งที่ครูพิเศษประกบทุกคาบ ใคร ๆ เรียกเขาว่าลูกนายพล",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "ขอรุ่นพี่ช่วยติวให้",
    "hint": "ได้คนช่วยดูทาง แต่ต้องรักษาคำพูด",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 1,
     "money": 0
    },
    "setFlags": [
     "cadet_prep_senior",
     "cadet_tips",
     "cadet_senior_tutor"
    ],
    "clearFlags": [],
    "schedule": [
     {
      "id": "D1",
      "afterYears": 1
     }
    ],
    "result": "รุ่นพี่นัดติวทุกวันอาทิตย์ ไม่คิดเงิน เล่าเรื่องรอบสองให้ฟังด้วย",
    "outcomes": null,
    "next": null,
    "requiresAnyFlags": [
     "cadet_senior_tutor",
     "knows_senior",
     "cadet_met_senior"
    ],
    "lockReason": "ยังไม่รู้จักรุ่นพี่ที่จะขอให้ช่วยติว"
   },
   {
    "label": "ซื้อข้อสอบเก่ามาอ่านเอง",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": -1
    },
    "setFlags": [
     "cadet_prep_self"
    ],
    "clearFlags": [],
    "schedule": [
     {
      "id": "D1",
      "afterYears": 1
     }
    ],
    "result": "ข้อสอบเก่าเย็บเล่มหนาเท่าหมอน ขีดเส้นใต้จนกระดาษทะลุ",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ไปหาเพื่อนติวที่ห้องสาม",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_prep_group"
    ],
    "clearFlags": [],
    "schedule": [
     {
      "id": "D1",
      "afterYears": 1
     }
    ],
    "result": "เจ้าของลายมือเป็นเด็กเก่งเลขที่สุดในสายชั้น แต่สารภาพตั้งแต่วันแรกว่าว่ายน้ำไม่เป็น",
    "outcomes": null,
    "next": null
   },
   {
    "label": "รับจ้างหลังเลิกเรียน เก็บค่าติว",
    "hint": "เวลาอ่านเหลือแต่ตอนดึก",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": -1,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 1
    },
    "setFlags": [
     "cadet_prep_self"
    ],
    "clearFlags": [],
    "schedule": [
     {
      "id": "D1",
      "afterYears": 1
     }
    ],
    "result": null,
    "outcomes": [
     {
      "p": 1,
      "whenFlag": "cadet_family_secret",
      "result": "บอกที่บ้านว่าไปช่วยร้านเพื่อน เงินค่าแรงซ่อนไว้ในกล่องดินสอ อ่านหนังสือได้แต่ตอนทุกคนหลับ",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 1,
      "whenNotFlag": "cadet_family_secret",
      "result": "เงินค่าแรงถูกเก็บแยกไว้ทีละน้อย อ่านหนังสือได้แต่ตอนหัวค่ำหลังกลับจากร้าน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   }
  ]
 },
 {
  "id": "E2R",
  "title": "หนังสือใต้ที่นอน",
  "ageMin": 14,
  "ageMax": 18,
  "kind": "scheduled",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream",
    "cadet_family_secret"
   ],
   "flagsNot": [
    "cadet_family_told"
   ],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "{ผู้ใหญ่}เก็บกวาดห้องของ {ชื่อ} แล้วเจอหนังสือข้อสอบเก่าเตรียมทหารซ่อนอยู่ใต้ที่นอน มื้อเย็นวันนั้นหนังสือเล่มนั้นวางอยู่บนโต๊ะ {ผู้ใหญ่}ถามว่า 'นี่จะสอบเตรียมทหารเหรอ ทำไมไม่เห็นบอกกันสักคำ'",
  "options": [
   {
    "label": "ขอโทษ แล้วเล่าให้ฟังทั้งหมด",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_told"
    ],
    "clearFlags": [
     "cadet_family_secret"
    ],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "ฟังจบ {ผู้ใหญ่}บอกว่า 'คราวหลังมีอะไรก็บอกกันตรง ๆ นะ{ถิ่น} ไม่ต้องแอบ' แล้วรับปากว่าค่าสมัครกับค่ารถไปสอบ เดี๋ยวที่บ้านออกให้",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "cadet_family_support"
      ]
     },
     {
      "p": 0.5,
      "result": "{ผู้ใหญ่}ไม่ดุ แต่ก็ไม่พูดเรื่องสอบหรือค่าติวอีกเลย",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "เล่าแล้วขอให้ไปส่งวันสอบ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 2,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_told"
    ],
    "clearFlags": [
     "cadet_family_secret"
    ],
    "schedule": [],
    "result": "{ผู้ใหญ่}รับปากจะไปส่ง มื้อเย็นที่เงียบอยู่กลับมาคุยกันได้อีกครั้ง",
    "outcomes": null,
    "next": null
   },
   {
    "label": "บอกว่าอยากลองเองก่อน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_told"
    ],
    "clearFlags": [
     "cadet_family_secret"
    ],
    "schedule": [],
    "result": "{ผู้ใหญ่}ถอนหายใจ 'เอาเถอะ อยากลองก็ลอง แต่อย่ามาแอบแบบนี้อีกล่ะ{ถิ่น}'",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ปัดว่าแค่หยิบมาอ่านเล่น",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": -2,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ไม่มีใครถามต่อ หนังสือหายไปจากโต๊ะ แต่มื้อเย็นหลังจากนั้นเงียบกว่าเดิม",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "D1-ก",
  "title": "หนังสือเล่มเดิม",
  "ageMin": 14,
  "ageMax": 18,
  "kind": "scheduled",
  "weight": 1,
  "repeatable": true,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": [
    "lower",
    "upper",
    "voc"
   ],
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [
    "cadet_prep_camp"
   ],
   "family": null,
   "poor": null
  },
  "variantOf": "D1",
  "replaces": null,
  "text": "ตารางอ่านหนังสือที่ {ชื่อ} เขียนติดฝาบ้านเลยกำหนดมาสามสัปดาห์แล้ว ไม่มีใครมาตรวจ ไม่มีใครดุ ข้อสอบเก่าเปิดค้างอยู่หน้าเดิม เสียงละครจากห้องข้าง ๆ ดังลอดมาทุกคืน",
  "options": [
   {
    "label": "ปิดประตู อ่านให้ครบตามตาราง",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "อ่านจบบทที่ค้างไว้ตอนเกือบเที่ยงคืน ละครจบไปนานแล้ว",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ย้ายไปอ่านที่ห้องสมุดโรงเรียน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ห้องสมุดเงียบจนได้ยินเสียงพัดลม อ่านได้มากกว่าที่บ้านเกือบเท่าตัว",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอดูตอนเดียว แล้วกลับมาอ่าน",
    "hint": "ตอนเดียวอาจไม่จบแค่ตอนเดียว",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "ดูจบตอนแล้วลุกกลับไปที่โต๊ะได้จริง",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "ตอนเดียวกลายเป็นทั้งเรื่อง ตารางอ่านเลื่อนไปอีกสัปดาห์",
      "fx": {
       "knowledge": -1,
       "health": 0,
       "happiness": 1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "พักสักเดือน ค่อยเริ่มใหม่",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": -1,
     "health": 0,
     "happiness": 2,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เดือนเดียวกลายเป็นสองเดือน ข้อสอบเก่ามีฝุ่นเกาะ",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ชวนเพื่อนติวมาอ่านด้วยกัน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "มีคนนั่งอ่านอยู่ตรงข้ามอีกคน จะเปิดหนังสือทิ้งไว้เฉย ๆ ก็ไม่ได้",
    "outcomes": null,
    "next": null,
    "requiresFlags": [
     "cadet_prep_group"
    ],
    "lockReason": "ยังไม่มีเพื่อนติวที่ฝันเดียวกัน"
   }
  ]
 },
 {
  "id": "D1-ข",
  "title": "หนังสือเล่มเดิม",
  "ageMin": 14,
  "ageMax": 18,
  "kind": "scheduled",
  "weight": 1,
  "repeatable": true,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": [
    "lower",
    "upper",
    "voc"
   ],
   "flagsHas": [
    "cadet_dream",
    "cadet_prep_camp"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": "D1",
  "replaces": null,
  "text": "คาบเช้าของค่ายติวเริ่มหกโมงครึ่ง เพื่อนร่วมห้องพักดึงผ้าห่มคลุมหัว บอกว่าวันนี้แค่คาบทบทวน ไม่เข้าก็ไม่เป็นไร ครูไม่เช็กชื่อ แต่ค่าค่ายจ่ายไปแล้วทั้งก้อน",
  "options": [
   {
    "label": "ลุกไปเข้าคาบคนเดียว",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ห้องติวโล่งไปครึ่งห้อง ครูสอนช้าลงจนถามได้ทุกข้อ",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ปลุกเพื่อนไปเข้าด้วยกัน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "วิ่งเข้าห้องทันตอนครูเริ่มเขียนกระดาน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "เพื่อนไม่ยอมตื่น แล้วไม่พูดด้วยไปทั้งวัน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": -1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "โดดคาบนี้คาบเดียว",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": -1,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "คาบเดียวกลายเป็นนิสัย สัปดาห์นั้นโดดไปสี่คาบ",
    "outcomes": null,
    "next": null
   },
   {
    "label": "นอนต่อ ค่อยลอกโน้ตเพื่อน",
    "hint": "โน้ตของคนอื่นไม่เหมือนได้ฟังเอง",
    "requiresMoney": 0,
    "fx": {
     "knowledge": -1,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "โน้ตที่ยืมมาลายมืออ่านไม่ออกไปครึ่งหน้า",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "D2-ก",
  "title": "คืนที่เพื่อนมาชวน",
  "ageMin": 14,
  "ageMax": 18,
  "kind": "pool",
  "weight": 1,
  "repeatable": true,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": [
    "lower",
    "upper",
    "voc"
   ],
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [
    "cadet_prep_camp"
   ],
   "family": null,
   "poor": null
  },
  "variantOf": "D2",
  "replaces": null,
  "text": "เย็นวันศุกร์เพื่อนกลุ่มเดิมมายืนรอหน้าบ้าน ชวน {ชื่อ} ออกไปเที่ยวในเมืองจนดึก 'อ่านทุกวันไม่เบื่อเหรอ ไปด้วยกันสักคืน' ข้อสอบเก่าบทที่ค้างไว้ยังวางอยู่บนโต๊ะ",
  "options": [
   {
    "label": "ปฏิเสธ อ่านต่อให้จบบท",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": -1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เสียงเพื่อนหายไปตามถนน บทที่ค้างไว้อ่านจบก่อนสี่ทุ่ม",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ไปแค่หัวค่ำ แล้วกลับมาอ่าน",
    "hint": "หัวค่ำของเพื่อนอาจยาวกว่าที่คิด",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "กลับถึงบ้านสามทุ่ม ยังอ่านต่อได้อีกบท",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 1,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "กลับมาก็เพลียจนหลับคาโต๊ะ",
      "fx": {
       "knowledge": -1,
       "health": 0,
       "happiness": 1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "ไปให้สุด คืนนี้ปิดหนังสือ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": -1,
     "health": 0,
     "happiness": 2,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "กลับถึงบ้านตีสอง สัปดาห์ต่อมาเพื่อนก็มาชวนอีก",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ชวนเพื่อนไปวิ่งรอบสนามแทน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เพื่อนบ่นตลอดทาง แต่ก็วิ่งครบสามรอบ",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "D2-ข",
  "title": "คืนที่เพื่อนมาชวน",
  "ageMin": 14,
  "ageMax": 18,
  "kind": "pool",
  "weight": 1,
  "repeatable": true,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": [
    "lower",
    "upper",
    "voc"
   ],
   "flagsHas": [
    "cadet_dream",
    "cadet_prep_camp"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": "D2",
  "replaces": null,
  "text": "ดึกแล้วในค่ายติว เพื่อนร่วมห้องนัดกันปีนรั้วไปกินข้าวต้มหน้าปากซอยแล้วต่อตลาดกลางคืน ครูเวรเดินตรวจรอบเดียวตอนสี่ทุ่ม พรุ่งนี้เช้ามีสอบเก็บคะแนน",
  "options": [
   {
    "label": "อยู่ห้อง ทวนบทของพรุ่งนี้",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ห้องพักเงียบทั้งห้อง ทวนได้ครบทุกบท",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ห้ามเพื่อน ชวนกันอ่านในห้อง",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "สุดท้ายทั้งห้องนั่งล้อมไฟฉายทวนข้อสอบด้วยกัน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "เพื่อนปีนรั้วไปกันหมด ทิ้งไว้คนเดียวในห้อง",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": -1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "ไปด้วย แต่กลับก่อนครูเวรเดิน",
    "hint": "ครูเวรอาจเดินเร็วกว่าที่นัดกันไว้",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "ปีนกลับเข้าห้องได้ก่อนไฟฉายครูเวรส่องมาหนึ่งนาที",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 1,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "ครูเวรยืนรอหน้าห้อง ทั้งกลุ่มโดนทำโทษจนไม่มีแรงอ่าน",
      "fx": {
       "knowledge": -1,
       "health": 0,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "ไปจนตลาดวาย",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": -1,
     "health": 0,
     "happiness": 2,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "สอบเก็บคะแนนเช้านั้นตอบได้ไม่ถึงครึ่ง",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "D3-ก",
  "title": "งานที่ไม่มีใครทำแทน",
  "ageMin": 14,
  "ageMax": 18,
  "kind": "pool",
  "weight": 1,
  "repeatable": true,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": [
    "lower",
    "upper",
    "voc"
   ],
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [
    "cadet_prep_camp"
   ],
   "family": null,
   "poor": null
  },
  "variantOf": "D3",
  "replaces": null,
  "text": "ช่วงนี้งานในบ้านล้นมือ ทั้งเฝ้าร้าน หุงข้าว ช่วยงานไร่ {ผู้ใหญ่}ไม่ได้ห้ามอ่านหนังสือ แต่ถ้า {ชื่อ} ไม่ทำ ก็ไม่มีใครทำแทน ข้อสอบเก่าเล่มหนาวางรออยู่มุมห้อง",
  "options": [
   {
    "label": "ทำงานให้เสร็จ แล้วอ่านตอนดึก",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": -1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ไฟโต๊ะอ่านหนังสือดับเป็นดวงสุดท้ายของบ้านทุกคืน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอแบ่งเวลา ตกลงกันให้ชัด",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "ได้ช่วงบ่ายวันอาทิตย์ไว้อ่านหนังสือทั้งช่วง",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "ตกลงกันได้ไม่กี่วัน งานก็ไหลกลับมาเท่าเดิม",
      "fx": {
       "knowledge": -1,
       "health": 0,
       "happiness": 0,
       "relations": -1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "ช่วยเต็มที่ พักหนังสือไว้ก่อน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": -1,
     "health": 0,
     "happiness": 0,
     "relations": 2,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "งานบ้านเสร็จทุกอย่าง ข้อสอบเก่าถูกใช้รองหม้อข้าวไปหนึ่งเล่ม",
    "outcomes": null,
    "next": null
   },
   {
    "label": "อ้างว่าต้องอ่าน เลี่ยงงานบ้าน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": -2,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ได้เวลาอ่านครบ แต่วงข้าวเย็นเงียบลงทุกวัน",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "D3-ข",
  "title": "งานที่ไม่มีใครทำแทน",
  "ageMin": 14,
  "ageMax": 18,
  "kind": "pool",
  "weight": 1,
  "repeatable": true,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": [
    "lower",
    "upper",
    "voc"
   ],
   "flagsHas": [
    "cadet_dream",
    "cadet_prep_camp"
   ],
   "flagsNot": ["cadet_family_secret"],
   "family": null,
   "poor": null
  },
  "variantOf": "D3",
  "replaces": null,
  "text": "จดหมายจากบ้านมาถึงค่ายติว ช่วงนี้งานที่บ้านล้นมือ ถ้าว่างขอให้กลับไปช่วยสักสัปดาห์ ค่าค่ายจ่ายไปแล้ว ห้องติวกำลังเข้าบทที่ออกสอบบ่อยที่สุด",
  "options": [
   {
    "label": "อยู่ค่ายต่อ ส่งเงินกลับไปช่วย",
    "hint": "ค่าขนมที่เหลือของเดือนนี้",
    "requiresMoney": 1,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": -1,
     "network": 0,
     "money": -1
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เขียนจดหมายตอบหนึ่งหน้า สัญญาว่าจบค่ายจะกลับไปช่วยทันที",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ไม่ตอบ ตั้งหน้าอ่านต่อ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": -2,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "จดหมายฉบับนั้นถูกสอดไว้ใต้หมอน ไม่ได้เปิดอ่านซ้ำ",
    "outcomes": null,
    "next": null
   },
   {
    "label": "กลับไปสองวัน แล้วรีบกลับค่าย",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "สองวันพอให้งานเดินต่อได้ กลับค่ายทันคาบเย็น",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "สองวันกลายเป็นห้าวัน กลับมาห้องติวไปไกลแล้ว",
      "fx": {
       "knowledge": -1,
       "health": 0,
       "happiness": 0,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "กลับไปช่วยทั้งสัปดาห์",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": -1,
     "health": 0,
     "happiness": 0,
     "relations": 2,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "กลับมาค่ายอีกที ห้องติวไปไกลกว่าที่ตามทันสามบท",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "E4",
  "title": "ห้าสิบเมตร",
  "ageMin": 14,
  "ageMax": 17,
  "kind": "pool",
  "weight": 1,
  "repeatable": true,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [
    "can_swim"
   ],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "วันแรกที่ลงสระ {ชื่อ} ว่ายได้ไม่ถึงสิบเมตรก็ต้องคว้าขอบสระ หายใจไม่ทัน รุ่นพี่ที่มาซ้อมด้วยบอกว่าสนามจริงจับเวลาว่ายห้าสิบเมตร คนที่ข้อเขียนผ่านแต่มาตกตรงนี้ก็มี",
  "options": [
   {
    "label": "ไปสระเทศบาลทุกเย็น",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "เดือนที่สามว่ายสุดสระได้โดยไม่แตะขอบ",
      "fx": {
       "knowledge": 0,
       "health": 1,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "can_swim"
      ]
     },
     {
      "p": 0.5,
      "result": "ปีนี้ไปได้แค่ครึ่งสระ แต่ไม่กลัวน้ำแล้ว",
      "fx": {
       "knowledge": 0,
       "health": 1,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "จ้างครูสอนว่ายน้ำ",
    "hint": "ค่าครู · ค่าสระ",
    "requiresMoney": 2,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": -2
    },
    "setFlags": [
     "can_swim"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "ครูแก้ท่าหายใจครั้งเดียว ที่เหลือว่ายไปเอง",
    "outcomes": null,
    "next": null
   },
   {
    "label": "หัดในคลองกับเพื่อน ๆ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "ลอยตัวเป็นก่อนสงกรานต์ ว่ายข้ามคลองได้ทั้งไปทั้งกลับ",
      "fx": {
       "knowledge": 0,
       "health": 1,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "can_swim"
      ]
     },
     {
      "p": 0.25,
      "result": "น้ำคลองทำให้ไข้ขึ้นทั้งอาทิตย์",
      "fx": {
       "knowledge": 0,
       "health": -1,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.25,
      "result": "ตะคริวกินกลางคลอง เพื่อนลากขึ้นฝั่งได้ทัน กลัวน้ำไปพักใหญ่",
      "fx": {
       "knowledge": 0,
       "health": -1,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "ชวนเพื่อนติวมาหัดด้วยกัน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "สองคนว่ายสุดสระได้ในวันเดียวกัน กอดคอกันกลางน้ำ",
      "fx": {
       "knowledge": 0,
       "health": 1,
       "happiness": 0,
       "relations": 2,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "can_swim",
       "cadet_a_swims",
       "cadet_bond_a"
      ]
     },
     {
      "p": 0.5,
      "result": "เราว่ายได้แล้ว แต่เพื่อนยังเกาะขอบสระทุกครั้ง",
      "fx": {
       "knowledge": 0,
       "health": 1,
       "happiness": 0,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "can_swim",
       "cadet_bond_a"
      ]
     }
    ],
    "next": null,
    "requiresFlags": [
     "cadet_prep_group"
    ],
    "lockReason": "ยังไม่มีเพื่อนติวที่ฝันเดียวกัน"
   },
   {
    "label": "เดี๋ยวค่อยว่า อ่านหนังสือก่อน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ชุดว่ายน้ำยังพับอยู่ในถุงเดิม",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "E5",
  "title": "ตีห้า",
  "ageMin": 14,
  "ageMax": 17,
  "kind": "pool",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "{ค่าย:เปิดเทอมแล้ว }นาฬิกาปลุกดังตอนตีห้า ข้างนอกยังมืด ลมเย็นลอดหน้าต่างเข้ามา เมื่อวานที่ราวดึงข้อในสนามโรงเรียน {ชื่อ} ดึงได้แค่สามครั้งก็ห้อยตัวค้าง เพื่อนข้างราวหัวเราะจนต้องหันหน้าหนี",
  "options": [
   {
    "label": "ออกไปวิ่งกับพ่อทุกเช้า",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "sporty"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "พ่อวิ่งช้ากว่าแต่ไม่เคยหยุด สองคนคุยกันมากกว่าที่เคยคุยมาทั้งปี",
    "outcomes": null,
    "next": null,
    "requiresFamily": "father",
    "showIf": {"family": "father"}
   },
   {
    "label": "นัดเพื่อนข้างบ้านวิ่งทุกเช้า",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "sporty"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "เพื่อนข้างบ้านวิ่งช้ากว่าแต่ไม่เคยผิดนัด สองคนคุยกันมากกว่าที่เคยคุยมาทั้งปี",
    "outcomes": null,
    "next": null,
    "hideIf": {"family": "father"}
   },
   {
    "label": "นัดเพื่อนติววิ่งรอบสนาม",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "sporty",
     "cadet_bond_a"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "ใครมาสายต้องเลี้ยงน้ำเต้าหู้ เดือนแรกเพื่อนเลี้ยงไปยี่สิบวัน",
    "outcomes": null,
    "next": null,
    "requiresFlags": [
     "cadet_prep_group"
    ],
    "lockReason": "ยังไม่มีเพื่อนติวที่ฝันเดียวกัน"
   },
   {
    "label": "วิ่งคนเดียว จับเวลาเองทุกวัน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "ปลายปีดึงข้อได้เกินสิบครั้ง",
      "fx": {
       "knowledge": 0,
       "health": 2,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "sporty"
      ]
     },
     {
      "p": 0.5,
      "result": "หักโหมจนข้อเท้าพลิก ต้องพักเกือบเดือน",
      "fx": {
       "knowledge": 0,
       "health": -1,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "กดปิด แล้วนอนต่อ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ฝันว่าวิ่งเข้าเส้นชัยเป็นคนแรก",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "E6-ก",
  "title": "คนที่รู้จักผู้ใหญ่",
  "ageMin": 15,
  "ageMax": 17,
  "kind": "pool",
  "weight": 0.5,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": ["cadet_family_secret"],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "คนรู้จักของญาติแวะมาที่บ้าน บอกว่ารู้จักผู้ใหญ่ในกองสอบ ฝากให้ติดได้แน่นอน แต่ต้องจ่ายก่อนเป็นก้อน เท่ากับรายได้ทั้งปีของบ้าน รับแต่เงินสด และห้ามบอกใครเด็ดขาด",
  "options": [
   {
    "label": "ปฏิเสธ จะสอบด้วยตัวเอง",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "refused_fixer"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "เขายักไหล่ บอกว่าอย่ามาเสียใจทีหลัง",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ให้{ผู้ใหญ่}ตัดสิน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "{ผู้ใหญ่}เชิญเขากลับ บอกว่าบ้านนี้สอบเอง",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "refused_fixer"
      ]
     },
     {
      "p": 0.5,
      "result": "{ผู้ใหญ่}แอบรวบเงินจ่ายไป ไม่กี่วัน{มือถือ:เบอร์นั้นก็ปิด|คนนั้นก็หายไปเลย ไปถามหาที่ไหนก็ไม่มีใครรู้จัก}",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": -1,
       "network": 0,
       "money": -3
      },
      "setFlags": [
       "scam_aware"
      ]
     }
    ],
    "next": null,
    "requiresFamily": "parent"
   },
   {
    "label": "แอบรวบรวมเงินจ่ายเอง",
    "hint": "ราคา: บาปเบา",
    "requiresMoney": 3,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.8,
      "result": "จ่ายครบแล้ว{มือถือ:เบอร์นั้นก็ปิดไปตลอดกาล|คนนั้นก็หายไปเลย ไม่มีใครเจออีก}",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": -3
      },
      "setFlags": [
       "scam_aware",
       "cadet_paid_fixer"
      ]
     },
     {
      "p": 0.2,
      "result": "{มือถือ:มีข้อความตอบกลับคำเดียวว่าเรียบร้อย|มีจดหมายตอบกลับมาบรรทัดเดียวว่าเรียบร้อย} ชื่อ {ชื่อ} ถูกจดลงสมุดของใครบางคน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": -3
      },
      "setFlags": [
       "took_bribe",
       "cadet_paid_fixer"
      ]
     }
    ],
    "next": null
   },
   {
    "label": "พาเรื่องไปแจ้งตำรวจ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "ตำรวจตามถึงบ้านเขา พบว่าหลอกมาแล้วหลายบ้าน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 1,
       "network": 1,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "เขาหายไปก่อน ญาติบางคนไม่พอใจที่ทำให้เสียหน้า",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": -1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   }
  ]
 },
 {
  "id": "E6-ข",
  "title": "ไม่มีทางลัด",
  "ageMin": 15,
  "ageMax": 17,
  "kind": "pool",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": "army",
   "notHeir": null,
   "yearMin": 2564,
   "yearMax": 2650,
   "school": null,
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": ["cadet_family_secret"],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "ใบประกาศรับสมัครสอบเตรียมทหารปีนี้มาถึงบ้าน {ทายาท:พ่อวางไว้บนโต๊ะ บอกว่าลูกทหารลูกใครก็สอบสนามเดียวกันหมด ไม่มีที่นั่งพิเศษให้ใคร แต่ปีก่อนลูกจ่าในหน่วยสอบติด ผู้บัญชาการทหารบกให้รางวัลหนึ่งหมื่นบาท แล้วพูดลอย ๆ ว่ารุ่นพี่ที่หน่วยติวเลขให้เด็กแถวบ้านพักทุกปี|แม่วางไว้บนโต๊ะ บอกว่าลูกพยาบาลหรือลูกนายพลก็สอบสนามเดียวกันหมด ไม่มีที่นั่งพิเศษให้ใคร แต่ปีก่อนลูกเพื่อนพยาบาลในโรงพยาบาลค่ายสอบติด ได้รางวัลจากกองทัพหนึ่งหมื่นบาท แล้วพูดลอย ๆ ว่านายทหารที่แม่รู้จักติวเด็กที่จะสอบให้ทุกปี|{ผู้ใหญ่}วางไว้บนโต๊ะ บอกว่าถ้าพ่อยังอยู่คงดีใจ ไม่มีใครเปิดทางให้หรอก ต้องสอบเองเหมือนทุกคน แล้วพูดลอย ๆ ว่าเพื่อนร่วมหน่วยของพ่อยังแวะมาถามข่าวทุกปีใหม่ เคยบอกว่าถ้า{ชื่อ}จะสอบให้ไปหาได้}",
  "options": [
   {
    "label": "ขอให้{ทายาท:รุ่นพี่ที่หน่วย|นายทหารคนนั้น|เพื่อนพ่อ}ช่วยติว",
    "hint": "ได้ติวฟรี แต่ต้องไปให้ตรงนัด",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 1,
     "money": 0
    },
    "setFlags": [
     "cadet_senior_tutor"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "นัดติวเลขทุกเย็นวันเสาร์ ไม่คิดเงิน บอกไว้ตั้งแต่วันแรกว่าสอนได้ แต่สอบต้องสอบเอง",
    "outcomes": null,
    "next": null
   },
   {
    "label": "สมัครเองเหมือนทุกคน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "อยากรู้ว่าตัวเองไปได้แค่ไหน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ถามว่ามีทางฝากชื่อกับกรรมการไหม",
    "hint": "ราคา: บาปเบา",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "ไม่มีใครพูดถึงเรื่องนี้อีก",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 2,
       "money": 0
      },
      "setFlags": [
       "took_bribe",
       "cadet_paid_fixer"
      ]
     },
     {
      "p": 0.5,
      "result": "เพื่อนในรุ่นรู้ว่ามีคนฝากชื่อ ไม่มีใครมองหน้าตรง ๆ",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -2,
       "relations": -1,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "took_bribe",
       "cadet_paid_fixer"
      ]
     }
    ],
    "next": null
   },
   {
    "label": "บอกว่าอยากเรียนสายอื่น",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": -1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_let_go"
    ],
    "clearFlags": [
     "cadet_dream"
    ],
    "schedule": [],
    "result": "ประกาศใบนั้นถูกพับเก็บเงียบ ๆ",
    "outcomes": null,
    "next": "STOP"
   }
  ]
 },
 {
  "id": "E7-ก",
  "title": "ทะเลสามวัน",
  "ageMin": 15,
  "ageMax": 15,
  "kind": "pool",
  "weight": 0.5,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": [
    "lower"
   ],
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "จบ ม.สาม เพื่อนทั้งห้องนัดไปทะเลด้วยกันสามวัน ค่ารถหารกันคนละนิด วันที่นัดตรงกับสัปดาห์ที่ตั้งใจจะอ่านหนักที่สุดพอดี เพื่อนสนิทแวะมาชวนถึงหน้าบ้านทุกเย็น",
  "options": [
   {
    "label": "อยู่บ้านอ่านหนังสือตามแผน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": -1,
     "relations": -1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "รูปหมู่ที่ทะเลไม่มีหน้าเรา",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ไปวันเดียว แล้วรีบกลับ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ได้เห็นทะเลครึ่งวัน นั่งรถกลับคนเดียวตอนค่ำ",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ไปให้สุด กลับมาค่อยอ่าน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": -1,
     "health": 0,
     "happiness": 2,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "สามวันที่หัวเราะจนเจ็บท้อง หนังสือไม่ได้เปิดสักหน้า",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ไปด้วย แต่วิ่งชายหาดทุกเช้า",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": -1,
     "health": 1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เพื่อนบ่นทุกเช้าแต่ก็ตื่นมาวิ่งด้วยทุกวัน",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "E7-ข",
  "title": "คืนวันเสาร์ที่งานวัด",
  "ageMin": 14,
  "ageMax": 15,
  "kind": "pool",
  "weight": 0.5,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "คนที่แอบชอบมาตั้งแต่เปิดเทอมชวนไปเดินงานวัดคืนวันเสาร์ ส่วนเช้าวันอาทิตย์มีสอบจำลองเตรียมทหารที่ต้องตื่นตั้งแต่ตีห้า",
  "options": [
   {
    "label": "ขอโทษ ขอไปสอบจำลองก่อน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": -1,
     "relations": -1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เขาบอกว่าไม่เป็นไร แต่ไม่ได้ชวนอีก",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ไปงานวัด กลับก่อนสามทุ่ม",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "ได้ตุ๊กตาจากซุ้มปาลูกโป่งหนึ่งตัว กลับถึงบ้านทันเวลา",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 1,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "กลับดึกกว่าที่ตั้งใจ ไปสอบจำลองทั้งที่ตาจะปิด",
      "fx": {
       "knowledge": -1,
       "health": 0,
       "happiness": 1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "ไปเต็มคืน ไม่สนสอบจำลอง",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": -1,
     "health": 0,
     "happiness": 2,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ชิงช้าสวรรค์รอบสุดท้ายของคืนนั้นจำได้ไปอีกนาน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ชวนมาอ่านหนังสือด้วยกันแทน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "เขาหัวเราะแล้วหอบหนังสือมานั่งข้างกันทั้งบ่าย",
      "fx": {
       "knowledge": 1,
       "health": 0,
       "happiness": 0,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "เขาไปงานวัดกับคนอื่น",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   }
  ]
 },
 {
  "id": "E8",
  "title": "ปีที่สองของเขา",
  "ageMin": 15,
  "ageMax": 17,
  "kind": "pool",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "ที่สนามซ้อมวิ่ง มีเด็กผู้ชายผิวคล้ำแดดที่ขี่รถมาจากอีกอำเภอ ซ้อมทุกเย็นไม่เคยขาด เขาเล่าว่าปีนี้ข้อเขียนผ่านแล้ว แต่มาตกรอบสองที่สระว่ายน้ำ ปีหน้าจะกลับมาใหม่",
  "options": [
   {
    "label": "ถามว่ารอบสองเป็นแบบไหน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_tips",
     "cadet_met_c"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "เขาวาดผังสนามสอบลงบนพื้นดินให้ดูทีละสถานี",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ชวนมาซ้อมด้วยกันทุกเย็น",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_met_c",
     "cadet_bond_c",
     "sporty"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "คนหนึ่งเก่งวิ่ง อีกคนเก่งว่ายน้ำ แลกกันสอนทุกเย็น",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ชวนเข้ากลุ่มติวของเรา",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_met_c",
     "cadet_bond_c",
     "cadet_tips"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "กลุ่มติวมีกันสามคน เพื่อนห้องสามได้คนช่วยสอนว่ายน้ำ",
    "outcomes": null,
    "next": null,
    "requiresFlags": [
     "cadet_prep_group"
    ],
    "lockReason": "ยังไม่มีกลุ่มติวให้ชวนเข้า"
   },
   {
    "label": "พยักหน้า แล้ววิ่งต่อคนเดียว",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "คิดในใจว่าเขาคือคู่แข่งอีกคน",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "S16",
  "title": "แจ้งสิทธิสอบเตรียมทหาร",
  "ageMin": 16,
  "ageMax": 16,
  "kind": "exam",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": [
    "upper",
    "voc"
   ],
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "ประกาศรับสมัครสอบเตรียมทหารปีนี้ออกแล้ว ปีนี้เป็นปีแรกที่ {ชื่อ} อายุถึงเกณฑ์ ใบสมัครวางอยู่บนโต๊ะ ช่องเลือกเหล่ายังว่าง เหลือแค่ตัดสินใจว่าจะยื่นปีนี้หรือรอให้พร้อมกว่านี้",
  "options": [
   {
    "label": "ยื่นใบสมัคร สอบปีนี้",
    "hint": "ต่อไปเลือกเหล่าที่จะสมัคร",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เขียนชื่อตัวเองลงใบสมัครช้า ๆ ทีละตัว",
    "outcomes": null,
    "next": "EXAM_DOOR"
   },
   {
    "label": "ไหว้พระขอพร แล้วยื่นใบสมัคร",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ไหว้พระที่วัดใกล้บ้านก่อนไปยื่นใบสมัคร ใจนิ่งขึ้นกว่าเมื่อเช้า",
    "outcomes": null,
    "next": "EXAM_DOOR"
   },
   {
    "label": "ยื่นใบสมัครพร้อมเพื่อนติว",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_bond_a"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "สองคนยื่นใบสมัครต่อแถวเดียวกัน ต่างคนต่างแอบดูว่าอีกคนเลือกเหล่าไหน",
    "outcomes": null,
    "next": "EXAM_DOOR",
    "requiresFlags": [
     "cadet_prep_group"
    ],
    "lockReason": "ยังไม่มีเพื่อนติวที่ฝันเดียวกัน"
   },
   {
    "label": "ปีนี้ยังไม่สอบ ขอเตรียมอีกปี",
    "hint": "ยังมีโอกาสสอบอีก แต่เวลาจะสั้นลง",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เก็บใบสมัครไว้ในแฟ้ม แล้วกลับไปเปิดข้อสอบเก่าหน้าเดิม",
    "outcomes": null,
    "next": "STOP"
   },
   {
    "label": "พอแค่นี้ ไปทางอื่น",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_let_go"
    ],
    "clearFlags": [
     "cadet_dream"
    ],
    "schedule": [],
    "result": "ใบสมัครแผ่นนั้นไม่ได้ถูกกรอก แต่ก็ไม่ได้ถูกทิ้ง",
    "outcomes": null,
    "next": "STOP"
   }
  ]
 },
 {
  "id": "S17",
  "title": "แจ้งสิทธิสอบเตรียมทหาร",
  "ageMin": 17,
  "ageMax": 17,
  "kind": "exam",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": [
    "upper",
    "voc"
   ],
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [
    "cadet_retry"
   ],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "ประกาศรับสมัครสอบเตรียมทหารออกอีกปี {ชื่อ} ยังอยู่ในเกณฑ์อายุ เพื่อนที่ฝันเดียวกันบางคนเลิกไปแล้ว บางคนยังซ้อมอยู่ทุกเย็น ใบสมัครแผ่นใหม่วางรออยู่บนโต๊ะ",
  "options": [
   {
    "label": "ยื่นใบสมัคร สอบปีนี้",
    "hint": "ต่อไปเลือกเหล่าที่จะสมัคร",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เขียนชื่อตัวเองลงใบสมัครช้า ๆ ทีละตัว",
    "outcomes": null,
    "next": "EXAM_DOOR"
   },
   {
    "label": "ไหว้พระขอพร แล้วยื่นใบสมัคร",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ไหว้พระที่วัดใกล้บ้านก่อนไปยื่นใบสมัคร ใจนิ่งขึ้นกว่าเมื่อเช้า",
    "outcomes": null,
    "next": "EXAM_DOOR"
   },
   {
    "label": "ยื่นใบสมัครพร้อมเพื่อนติว",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_bond_a"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "สองคนยื่นใบสมัครต่อแถวเดียวกัน ต่างคนต่างแอบดูว่าอีกคนเลือกเหล่าไหน",
    "outcomes": null,
    "next": "EXAM_DOOR",
    "requiresFlags": [
     "cadet_prep_group"
    ],
    "lockReason": "ยังไม่มีเพื่อนติวที่ฝันเดียวกัน"
   },
   {
    "label": "ปีนี้ยังไม่สอบ ขอเตรียมอีกปี",
    "hint": "ปีหน้าต้องเลือกว่าจะสอบต่อหรือพอ",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เก็บใบสมัครไว้ในแฟ้ม แล้วกลับไปเปิดข้อสอบเก่าหน้าเดิม",
    "outcomes": null,
    "next": "STOP"
   },
   {
    "label": "พอแค่นี้ ไปทางอื่น",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_let_go"
    ],
    "clearFlags": [
     "cadet_dream"
    ],
    "schedule": [],
    "result": "ใบสมัครแผ่นนั้นไม่ได้ถูกกรอก แต่ก็ไม่ได้ถูกทิ้ง",
    "outcomes": null,
    "next": "STOP"
   }
  ]
 },
 {
  "id": "S17-retry",
  "title": "แจ้งสิทธิสอบเตรียมทหาร",
  "ageMin": 17,
  "ageMax": 17,
  "kind": "exam",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": [
    "upper",
    "voc"
   ],
   "flagsHas": [
    "cadet_dream",
    "cadet_retry"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": "S17",
  "replaces": null,
  "text": "ประกาศรับสมัครสอบเตรียมทหารออกอีกปี ใบประกาศผลของปีก่อนยังพับอยู่ในลิ้นชัก {ชื่อ} รู้แล้วว่าสนามจริงหน้าตาเป็นอย่างไร เหลือแค่ตัดสินใจว่าจะกลับไปอีกครั้งไหม",
  "options": [
   {
    "label": "ยื่นใบสมัคร สอบปีนี้",
    "hint": "ต่อไปเลือกเหล่าที่จะสมัคร",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เขียนชื่อตัวเองลงใบสมัครช้า ๆ ทีละตัว",
    "outcomes": null,
    "next": "EXAM_DOOR"
   },
   {
    "label": "ไหว้พระขอพร แล้วยื่นใบสมัคร",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ไหว้พระที่วัดใกล้บ้านก่อนไปยื่นใบสมัคร ใจนิ่งขึ้นกว่าเมื่อเช้า",
    "outcomes": null,
    "next": "EXAM_DOOR"
   },
   {
    "label": "ยื่นใบสมัครพร้อมเพื่อนติว",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_bond_a"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "สองคนยื่นใบสมัครต่อแถวเดียวกัน ต่างคนต่างแอบดูว่าอีกคนเลือกเหล่าไหน",
    "outcomes": null,
    "next": "EXAM_DOOR",
    "requiresFlags": [
     "cadet_prep_group"
    ],
    "lockReason": "ยังไม่มีเพื่อนติวที่ฝันเดียวกัน"
   },
   {
    "label": "ปีนี้ยังไม่สอบ ขอเตรียมอีกปี",
    "hint": "ปีหน้าต้องเลือกว่าจะสอบต่อหรือพอ",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เก็บใบสมัครไว้ในแฟ้ม แล้วกลับไปเปิดข้อสอบเก่าหน้าเดิม",
    "outcomes": null,
    "next": "STOP"
   },
   {
    "label": "พอแค่นี้ ไปทางอื่น",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_let_go"
    ],
    "clearFlags": [
     "cadet_dream"
    ],
    "schedule": [],
    "result": "ใบสมัครแผ่นนั้นไม่ได้ถูกกรอก แต่ก็ไม่ได้ถูกทิ้ง",
    "outcomes": null,
    "next": "STOP"
   }
  ]
 },
 {
  "id": "S18",
  "title": "ครั้งสุดท้ายที่สมัครได้",
  "ageMin": 18,
  "ageMax": 18,
  "kind": "exam",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": [
    "upper",
    "voc"
   ],
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "เพื่อนร่วมชั้นทยอยกรอกใบสมัครเรียนต่อและใบสมัครงาน ส่วนประกาศรับสมัครเตรียมทหารปีนี้เป็นปีสุดท้ายที่ {ชื่อ} ยังอยู่ในเกณฑ์อายุ ถ้าเลือกสอบต่อ เรื่องเรียนต่อต้องรอจนรู้ผล",
  "options": [
   {
    "label": "สอบต่อ ขออีกปีสุดท้าย",
    "hint": "เรื่องเรียนต่อต้องรอจนรู้ผลสอบ",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เพื่อนแยกย้ายไปคนละทาง {ชื่อ} ยังตื่นตีห้าเหมือนเดิม",
    "outcomes": null,
    "next": "EXAM_DOOR"
   },
   {
    "label": "สอบต่อ ทำงานเก็บเงินไปด้วย",
    "hint": "มีเงินค่าสมัคร แต่เวลาอ่านน้อยลง",
    "requiresMoney": 0,
    "fx": {
     "knowledge": -1,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 1
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "กลางวันยกของที่ร้านวัสดุ กลางคืนอ่านข้อสอบเก่าจนหลับคาโต๊ะ",
    "outcomes": null,
    "next": "EXAM_DOOR"
   },
   {
    "label": "สอบต่อกับเพื่อนที่ตกด้วยกัน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_bond_c"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "สนามซ้อมวิ่งเดิม คนเดิม รอบนี้ไม่มีใครพูดว่าปีหน้าอีกแล้ว",
    "outcomes": null,
    "next": "EXAM_DOOR",
    "requiresFlags": [
     "cadet_met_c"
    ],
    "lockReason": "ไม่มีเพื่อนที่สอบซ้ำด้วยกัน"
   },
   {
    "label": "พอแล้ว ไปทางที่เพื่อนไป",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_let_go"
    ],
    "clearFlags": [
     "cadet_dream"
    ],
    "schedule": [],
    "result": "พับเครื่องแบบพลศึกษาเก็บลงก้นตู้ แล้วหยิบใบสมัครแผ่นอื่นขึ้นมาแทน",
    "outcomes": null,
    "next": "STOP"
   },
   {
    "label": "พอ เก็บใบสมัครไว้ที่ระลึก",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_let_go"
    ],
    "clearFlags": [
     "cadet_dream"
    ],
    "schedule": [],
    "result": "ใบสมัครที่ไม่ได้ยื่นถูกสอดไว้ในสมุดเล่มเก่า ไม่เสียดาย แค่อยากจำไว้ว่าเคยฝัน",
    "outcomes": null,
    "next": "STOP"
   }
  ]
 },
 {
  "id": "E9-ก",
  "title": "คืนก่อนสอบ",
  "ageMin": 16,
  "ageMax": 18,
  "kind": "exam",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": [
    "กรุงเทพฯ และปริมณฑล"
   ],
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": [
    "upper",
    "voc"
   ],
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": "E9",
  "replaces": null,
  "text": "รถทัวร์ออกจากบ้านตั้งแต่ฟ้ายังไม่สว่าง ถึงเมืองที่มีสนามสอบตอนบ่าย ในกระเป๋ามีบัตรประจำตัวสอบ ดินสอสองแท่ง กับแว่นว่ายน้ำ ทั้งเมืองเต็มไปด้วยเด็กผู้ชายหัวเกรียนที่มาเพื่อสิ่งเดียวกัน คืนนี้ต้องหาที่นอนให้ได้",
  "options": [
   {
    "label": "นอนบ้านญาติ อ่านทวนอีกรอบ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "อ่านจบเล่มก่อนเที่ยงคืน หลับยาวถึงเช้า",
      "fx": {
       "knowledge": 1,
       "health": 0,
       "happiness": 0,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "อ่านเพลินจนตีสอง ตื่นมาตาแดงก่ำ",
      "fx": {
       "knowledge": 1,
       "health": -1,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "ห้องพักถูกใกล้สนาม นอนแต่หัวค่ำ",
    "hint": "ค่าห้อง · ค่ารถเข้าเมือง",
    "requiresMoney": 1,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": -1
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ห้องแคบจนกางแขนไม่สุด แต่หลับสนิท",
    "outcomes": null,
    "next": null
   },
   {
    "label": "นอนศาลาวัดกับเด็กสอบคนอื่น",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": -1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เสื่อแถวเดียวกันมีเด็กสอบจากหลายจังหวัด คุยกันจนดึกว่าจะสมัครเหล่าไหน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "สวดมนต์ กำพระที่แม่ให้แล้วนอน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "พระองค์เล็กที่แม่ยัดใส่กระเป๋าเสื้อตอนเช้ายังอุ่นอยู่ในมือ",
    "outcomes": null,
    "next": null,
    "requiresFamily": "mother",
    "showIf": {
     "family": "mother",
     "flagsNot": [
      "cadet_family_secret"
     ]
    }
   },
   {
    "label": "สวดมนต์ กำพระประจำตัวแล้วนอน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "พระองค์เล็กที่ห้อยคอมาตั้งแต่เด็กอุ่นอยู่ในมือ",
    "outcomes": null,
    "next": null,
    "hideIf": {
     "family": "mother",
     "flagsNot": [
      "cadet_family_secret"
     ]
    }
   },
   {
    "label": "นั่งคุยกับเพื่อนติวจนดึก",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": -1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_bond_a"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 1,
      "result": "เพื่อนบอกว่าตอนนี้ไม่กลัวสระแล้ว ขอบใจที่ลากลงน้ำด้วยกัน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [],
      "whenFlag": "cadet_a_swims"
     },
     {
      "p": 1,
      "result": "พอพูดถึงสระว่ายน้ำ เพื่อนก็เงียบไปเฉย ๆ",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [],
      "whenNotFlag": "cadet_a_swims"
     }
    ],
    "next": null,
    "requiresFlags": [
     "cadet_prep_group"
    ],
    "lockReason": "ไม่ได้มากับเพื่อนติว"
   }
  ]
 },
 {
  "id": "E9-ข",
  "title": "คืนก่อนสอบ",
  "ageMin": 16,
  "ageMax": 18,
  "kind": "exam",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": [
    "กรุงเทพฯ และปริมณฑล"
   ],
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": [
    "upper",
    "voc"
   ],
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": "E9",
  "replaces": null,
  "text": "สนามสอบอยู่ห่างบ้านไม่กี่ป้ายรถเมล์ แต่คืนนี้{ลับ:ที่บ้านดูทีวีกันตามปกติ ไม่มีใครรู้ว่าพรุ่งนี้มีอะไร|ทั้งบ้านเงียบผิดปกติ} บัตรประจำตัวสอบวางอยู่บนโต๊ะข้างดินสอสองแท่งกับแว่นว่ายน้ำ ข้างนอกมีเสียงรถวิ่งผ่านไม่ขาดสาย",
  "options": [
   {
    "label": "อ่านทวนอีกรอบ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "อ่านจบเล่มก่อนเที่ยงคืน หลับยาวถึงเช้า",
      "fx": {
       "knowledge": 1,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "อ่านเพลินจนตีสอง ตื่นมาตาแดงก่ำ",
      "fx": {
       "knowledge": 1,
       "health": -1,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "ออกไปวิ่งเบา ๆ รอบซอย",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "วิ่งสองรอบซอย กลับมาอาบน้ำแล้วหลับง่าย",
    "outcomes": null,
    "next": null
   },
   {
    "label": "เข้านอนตั้งแต่สองทุ่ม",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "หลับไปก่อนจะได้นับแกะ",
      "fx": {
       "knowledge": 0,
       "health": 1,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "นอนลืมตาฟังเสียงรถจนตีหนึ่ง",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "สวดมนต์ กำพระที่แม่ให้แล้วนอน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "พระองค์เล็กที่แม่ยื่นให้หลังมื้อเย็นยังอุ่นอยู่ในมือ",
    "outcomes": null,
    "next": null,
    "requiresFamily": "mother",
    "showIf": {
     "family": "mother",
     "flagsNot": [
      "cadet_family_secret"
     ]
    }
   },
   {
    "label": "สวดมนต์ กำพระประจำตัวแล้วนอน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "พระองค์เล็กที่ห้อยคอมาตั้งแต่เด็กอุ่นอยู่ในมือ",
    "outcomes": null,
    "next": null,
    "hideIf": {
     "family": "mother",
     "flagsNot": [
      "cadet_family_secret"
     ]
    }
   },
   {
    "label": "นัดเพื่อนติวมานั่งหน้าบ้าน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": -1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_bond_a"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 1,
      "result": "เพื่อนบอกว่าตอนนี้ไม่กลัวสระแล้ว ขอบใจที่ลากลงน้ำด้วยกัน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [],
      "whenFlag": "cadet_a_swims"
     },
     {
      "p": 1,
      "result": "พอพูดถึงสระว่ายน้ำ เพื่อนก็เงียบไปเฉย ๆ",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [],
      "whenNotFlag": "cadet_a_swims"
     }
    ],
    "next": null,
    "requiresFlags": [
     "cadet_prep_group"
    ],
    "lockReason": "ไม่มีเพื่อนติวให้นัด"
   }
  ]
 },
 {
  "id": "EXAM_MORNING",
  "title": "เช้าวันสอบ",
  "ageMin": 16,
  "ageMax": 18,
  "kind": "exam",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": [
    "upper",
    "voc"
   ],
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "เช้าวันสอบ หน้าประตูสนามมีเด็กผู้ชายหัวเกรียนเข้าแถวยาวจนเลยรั้ว ผู้ปกครองนั่งรอใต้ต้นไม้ {ชื่อ} กำบัตรประจำตัวสอบไว้แน่น แล้วก้าวเข้าประตูตามแถวไป",
  "options": [
   {
    "label": "เข้าห้องสอบ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": null,
    "next": "STOP"
   }
  ]
 },
 {
  "id": "U1",
  "title": "ปิดเทอมที่สวนผลไม้",
  "ageMin": 13,
  "ageMax": 17,
  "kind": "pool",
  "weight": 1.5,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [
    "cadet_prep_camp",
    "cadet_prep_group",
    "cadet_prep_self",
    "cadet_prep_senior"
   ],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "ปิดเทอมใหญ่ สวนผลไม้ท้ายหมู่บ้านติดป้ายหาคนช่วยเก็บ จ่ายเป็นรายวัน เพื่อนในซอยลงชื่อกันไปครึ่งห้อง อีกกลุ่มชวน {ชื่อ} ไปเที่ยวทะเลกับบ้านเพื่อนทั้งอาทิตย์ ค่ารถหารกัน",
  "options": [
   {
    "label": "รับจ้างเก็บผลไม้ทั้งปิดเทอม",
    "hint": "แดดทั้งวัน ปวดหลังทุกเย็น",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": -1,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 2
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.6,
      "result": "เจ้าของสวนชอบที่มาตรงเวลาทุกวัน วันสุดท้ายแถมเงินให้อีกก้อน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 1
      },
      "setFlags": []
     },
     {
      "p": 0.4,
      "result": "ฝนตกกลางเดือนจนสวนหยุดเก็บไปหลายวัน ค่าแรงได้ไม่เต็มอย่างที่หวัง",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": -1
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "เก็บครึ่งเดือน แล้วไปทะเล",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 1
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "กลับจากสวนได้สองวันก็ขึ้นรถไปทะเล ผิวดำจนเพื่อนจำแทบไม่ได้",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ไปทะเลกับเพื่อนทั้งอาทิตย์",
    "hint": "ต้องควักค่ารถค่ากินเอง",
    "requiresMoney": 1,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 2,
     "relations": 0,
     "network": 1,
     "money": -1
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "นอนเต็นท์ริมหาด ตื่นมาเล่นน้ำกันตั้งแต่เช้า เงินในกระปุกบางลงไปเยอะ",
    "outcomes": null,
    "next": null
   },
   {
    "label": "อยู่บ้านอ่านข้อสอบเก่า",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "บ้านเงียบทั้งปิดเทอม ได้ยินแต่เสียงพัดลมกับเสียงพลิกกระดาษ",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "U2",
  "title": "ซองจากผู้ใหญ่",
  "ageMin": 13,
  "ageMax": 17,
  "kind": "pool",
  "weight": 1.5,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [
    "cadet_prep_camp",
    "cadet_prep_group",
    "cadet_prep_self",
    "cadet_prep_senior"
   ],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "วันรวมญาติปีนี้คนกลับบ้านกันพร้อมหน้า ผู้ใหญ่หลายคนยัดซองใส่มือหลาน ๆ ป้าคนหนึ่งรู้ว่า {ชื่อ} จะสอบเตรียมทหาร เลยกำมือไว้นานกว่าคนอื่น 'เอาไว้ซื้อหนังสือนะ' คืนนั้นเพื่อนนัดไปเที่ยวงานวัด",
  "options": [
   {
    "label": "เก็บใส่กระปุกทั้งหมด",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 1
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "ลุงที่ทำงานในเมืองให้ซองหนาเป็นพิเศษ นับรวมแล้วมากกว่าที่คิด",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 1
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "ซองส่วนใหญ่บางพอ ๆ กับทุกปี แต่ก็หยอดกระปุกได้เต็มก้นแล้ว",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "แบ่งครึ่ง ไปเที่ยวงานวัด",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 1
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ปาเป้าได้ตุ๊กตามาตัวหนึ่ง กินลูกชิ้นทอดจนอิ่ม ยังเหลือเงินกลับมาครึ่งซอง",
    "outcomes": null,
    "next": null
   },
   {
    "label": "เลี้ยงเพื่อนทั้งกลุ่มคืนนี้",
    "hint": "สนุก แต่ซองว่างตั้งแต่คืนแรก",
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 1,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ทั้งกลุ่มนั่งล้อมโต๊ะส้มตำจนงานเลิก เพื่อนบอกว่าปีหน้าจะเลี้ยงคืน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ฝาก{ผู้ใหญ่}เก็บไว้ให้",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 1
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.4,
      "whenFlag": "cadet_family_told",
      "whenNotFlag": "cadet_family_support",
      "result": "{ผู้ใหญ่}รับซองไว้ แล้วบอกว่าจะสมทบให้จนพอค่าติว",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "cadet_family_support"
      ]
     },
     {
      "p": 0.6,
      "whenFlag": "cadet_family_told",
      "result": "{ผู้ใหญ่}จดตัวเลขไว้หลังปฏิทิน บอกว่าจะเก็บไว้ให้ไม่ให้หาย",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 1,
      "whenNotFlag": "cadet_family_told",
      "result": "{ผู้ใหญ่}ถามว่าจะเก็บไว้ทำอะไร {ชื่อ} ตอบแค่ว่าซื้อหนังสือ",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   }
  ]
 },
 {
  "id": "U3",
  "title": "ร้านข้างบ้านขาดคน",
  "ageMin": 13,
  "ageMax": 17,
  "kind": "pool",
  "weight": 1.5,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [
    "cadet_prep_camp",
    "cadet_prep_group",
    "cadet_prep_self",
    "cadet_prep_senior"
   ],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "ร้านข้าวแกงข้างบ้านขาดคนล้างจานกับยกของช่วงเย็น เจ้าของร้านเดินมาถามว่า {ชื่อ} ว่างไหม ให้ค่าแรงเป็นรายสัปดาห์ แถมข้าวเย็นทุกวัน",
  "options": [
   {
    "label": "รับทำทุกเย็นหลังเลิกเรียน",
    "hint": "เวลาอ่านหนังสือเหลือแต่ตอนดึก",
    "requiresMoney": 0,
    "fx": {
     "knowledge": -1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 2
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "มือเปื่อยจากน้ำยาล้างจาน แต่ทุกวันเสาร์มีซองค่าแรงวางรออยู่บนโต๊ะ",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ทำเฉพาะเสาร์อาทิตย์",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 1
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "วันธรรมดาอ่านหนังสือ เสาร์อาทิตย์ยกลังน้ำแข็ง ได้เงินไม่มากแต่ไม่เสียเวลาเรียน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ชวนเพื่อนมาทำด้วยกัน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "สองคนทำงานเสร็จเร็ว คุยกันทั้งเย็น เจ้าของร้านชมว่าขยันกันทั้งคู่",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 1,
       "relations": 0,
       "network": 1,
       "money": 1
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "เพื่อนมาสายบ่อยจนเจ้าของร้านบอกว่าพอแค่นี้ก่อน ทั้งสองคน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "ขอบคุณ แต่ขอเวลาอ่านหนังสือ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เจ้าของร้านพยักหน้า บอกว่าถ้าเปลี่ยนใจให้มาบอก ข้าวเย็นยังมีเหลือเสมอ",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "U4",
  "title": "พี่กลับบ้านช่วงลาพัก",
  "ageMin": 13,
  "ageMax": 17,
  "kind": "pool",
  "weight": 1.5,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2506,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream",
    "knows_senior"
   ],
   "flagsNot": [
    "cadet_prep_camp",
    "cadet_prep_group",
    "cadet_prep_self",
    "cadet_prep_senior",
    "cadet_senior_tutor"
   ],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "รุ่นพี่ที่เคยวิ่งผ่านหน้าบ้านทุกเช้ากลับมาช่วงลาพัก ผมสั้นเกรียน ยืนตัวตรงกว่าเดิม แม่ของพี่เขาเล่าให้คนทั้งซอยฟังว่าลูกชายอยู่บ้านได้ไม่กี่วัน",
  "options": [
   {
    "label": "ไปขอให้พี่ช่วยติว",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.6,
      "result": "พี่หัวเราะ บอกว่าจำได้ แล้วนัดติวทุกวันอาทิตย์ที่กลับบ้านได้ ไม่คิดเงิน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 1,
       "money": 0
      },
      "setFlags": [
       "cadet_senior_tutor"
      ]
     },
     {
      "p": 0.4,
      "result": "พี่บอกตรง ๆ ว่าปีนี้ฝึกหนัก กลับบ้านไม่ได้บ่อย แต่ยื่นสมุดจดสูตรเก่าให้หนึ่งเล่ม",
      "fx": {
       "knowledge": 1,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "ถามแค่ว่าข้อสอบยากตรงไหน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "พี่เล่าว่าเลขกับอังกฤษคือด่านใหญ่ ส่วนวิ่งกับว่ายน้ำห้ามประมาทเด็ดขาด",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ชวนพี่ไปวิ่งตอนเช้าด้วยกัน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "วิ่งครบสามรอบสนาม พี่หันมาบอกว่าถ้าอยากติวเลขก็มาหาที่บ้านได้",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 1,
       "money": 0
      },
      "setFlags": [
       "cadet_senior_tutor"
      ]
     },
     {
      "p": 0.5,
      "result": "พี่วิ่งเร็วจนตามไม่ทัน กลับถึงบ้านขาสั่นไปทั้งวัน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "อาย ได้แต่ยกมือไหว้",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ยืนไหว้อยู่หน้ารั้ว พี่รับไหว้แล้วเดินเข้าบ้านไป คำที่เตรียมไว้ยังค้างอยู่ในคอ",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "U5",
  "title": "ห้องสมุดวันเสาร์",
  "ageMin": 13,
  "ageMax": 17,
  "kind": "pool",
  "weight": 1.5,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream"
   ],
   "flagsNot": [
    "cadet_prep_camp",
    "cadet_prep_group",
    "cadet_prep_self",
    "cadet_prep_senior",
    "knows_senior",
    "cadet_senior_tutor"
   ],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "ครูแนะแนวประกาศหน้าเสาธงว่ารุ่นพี่ศิษย์เก่าที่สอบติดเตรียมทหารเมื่อปีก่อน จะกลับมาติวให้รุ่นน้องฟรีทุกวันเสาร์ที่ห้องสมุด ใครสนใจให้มาลงชื่อ กระดาษหน้าห้องแนะแนวยังว่างอยู่ครึ่งหน้า",
  "options": [
   {
    "label": "ลงชื่อ ไปตั้งแต่เสาร์แรก",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.6,
      "result": "พี่เห็นว่ามาทุกเสาร์ไม่เคยขาด เลยรับปากว่าจะติวให้จนถึงวันสอบ",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 1,
       "money": 0
      },
      "setFlags": [
       "knows_senior",
       "cadet_senior_tutor"
      ]
     },
     {
      "p": 0.4,
      "result": "คนมาแน่นห้องสมุดจนพี่จำชื่อใครไม่ได้ แต่ก็ได้ข้อสอบเก่ากลับมาปึกหนึ่ง",
      "fx": {
       "knowledge": 1,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "ฝากลูกพี่ลูกน้องถามเพื่อนที่ติด",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "เพื่อนของลูกพี่ลูกน้องว่างพอดี นัดติวที่บ้านทุกวันอาทิตย์",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 1,
       "money": 0
      },
      "setFlags": [
       "knows_senior",
       "cadet_senior_tutor"
      ]
     },
     {
      "p": 0.5,
      "result": "เพื่อนของลูกพี่ลูกน้องฝากบอกว่ายังฝึกอยู่ ว่างเมื่อไรจะติดต่อมา",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "knows_senior"
      ]
     }
    ],
    "next": null
   },
   {
    "label": "อายเกินกว่าจะไปลงชื่อ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เดินผ่านหน้าห้องแนะแนวสามรอบ ไม่กล้าหยิบปากกาสักครั้ง",
    "outcomes": null,
    "next": null
   },
   {
    "label": "เสาร์ต้องช่วยงานบ้าน ไว้ค่อยไป",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ทั้งเช้าวันเสาร์หมดไปกับงานบ้าน ชื่อบนกระดาษเต็มหน้าก่อนจะว่างไปลง",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "U6",
  "title": "เงินก้อนปลายปี",
  "ageMin": 13,
  "ageMax": 17,
  "kind": "pool",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream",
    "cadet_family_told"
   ],
   "flagsNot": [
    "cadet_prep_camp",
    "cadet_prep_group",
    "cadet_prep_self",
    "cadet_prep_senior",
    "cadet_family_support",
    "cadet_family_secret"
   ],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "ปลายปีที่บ้านมีรายได้เข้ามามากกว่าที่คิด {ผู้ใหญ่}นั่งนับเงินบนเสื่อ แล้วเรียก {ชื่อ} มานั่งข้าง ๆ 'เรื่องค่าติวที่เคยบอก ยังคิดจะไปอยู่ไหม'",
  "options": [
   {
    "label": "รับไว้ สัญญาว่าจะตั้งใจ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_support"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "{ผู้ใหญ่}แบ่งเงินใส่ซองแยกไว้ เขียนหน้าซองว่าค่าติว",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอครึ่งเดียว ที่เหลือหาเอง",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 2
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ได้เงินมาก้อนหนึ่ง {ผู้ใหญ่}บอกว่าถ้าขาดเท่าไรค่อยมาว่ากัน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอแค่ค่าหนังสือก็พอ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 1
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "หนังสือเตรียมสอบเล่มใหม่วางบนโต๊ะ กลิ่นกระดาษยังไม่จาง",
    "outcomes": null,
    "next": null
   },
   {
    "label": "เก็บไว้ใช้ในบ้านก่อนดีกว่า",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 2,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "{ผู้ใหญ่}เงียบไปพักหนึ่ง แล้วตบไหล่เบา ๆ บอกว่าโตแล้วจริง ๆ",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "F1-ก",
  "title": "ที่บ้านหาเงินค่าติว",
  "ageMin": 13,
  "ageMax": 17,
  "kind": "scheduled",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_family_support",
    "fund:borrow_relative"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": "F1",
  "replaces": null,
  "text": "ที่บ้านรับปากจะออกค่าติวให้ {ชื่อ} แต่ไม่มีเงินเก็บ {ผู้ใหญ่}จึงไปขอยืมญาติ ตกค่ำกลับมาพร้อมซองเงิน บอกว่า 'ขายข้าวได้แล้วค่อยทยอยคืนเขา ป้าเขาฝากบอกว่าให้ตั้งใจนะ{ถิ่น}'",
  "options": [
   {
    "label": "รับเงินไว้ สัญญาว่าจะตั้งใจ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "family_debt"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "{ชื่อ} รับซองไว้ด้วยสองมือ ตั้งใจว่าจะไม่ทำให้ญาติผิดหวัง",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอไปติวค่ายที่ถูกกว่า",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "family_debt"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "เลือกค่ายติวในอำเภอที่ถูกกว่าในเมืองมาก เงินที่เหลือเอาไปคืนญาติก่อน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "รับจ้างหลังเลิกเรียนช่วยใช้หนี้",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": -1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 1
    },
    "setFlags": [
     "family_debt"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "ทุกวันเสาร์ไปช่วยขนของที่ร้านวัสดุ ค่าแรงแยกเก็บไว้คืนญาติ",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ไม่รับเงิน จะอ่านหนังสือเอง",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [
     "cadet_family_support"
    ],
    "schedule": [],
    "result": "{ผู้ใหญ่}เอาซองไปคืนญาติทั้งที่ยังไม่แกะ ไม่ว่าอะไร แต่มื้อเย็นนั้นเงียบกว่าปกติ",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "F1-ข",
  "title": "ที่บ้านหาเงินค่าติว",
  "ageMin": 13,
  "ageMax": 17,
  "kind": "scheduled",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_family_support",
    "fund:loan_shark"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": "F1",
  "replaces": null,
  "text": "ที่บ้านรับปากจะออกค่าติวให้ {ชื่อ} แต่ไม่มีเงินเก็บ {ผู้ใหญ่}จึงไปกู้เงินรายวันในตลาด บอกว่า 'ดอกนิดเดียวเอง ขายของไม่กี่วันก็หมดแล้ว{ถิ่น}' แต่ทุกเย็น {ชื่อ} เห็นสมุดจดยอดส่งดอกวางอยู่ข้างกระป๋องเงิน",
  "options": [
   {
    "label": "รับเงินไว้ สัญญาว่าจะตั้งใจ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "family_debt"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "{ชื่อ} รับปากว่าจะสอบให้ติดรอบเดียว ตกเย็นเห็นที่บ้านนับเหรียญแยกไว้ส่งดอก",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอให้ไปยืมที่ที่ดอกถูกกว่า",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "family_debt"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "ญาติช่วยออกเงินปิดหนี้รายวันให้ แล้วที่บ้านค่อยผ่อนคืนญาติแทน ดอกเบาลงมาก",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "ถามไปหลายที่ ไม่มีใครมีเงินให้ยืม ที่บ้านยังต้องส่งดอกรายวันต่อไป",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ],
    "next": null
   },
   {
    "label": "ช่วยขายของหาเงินส่งดอก",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": -1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 1
    },
    "setFlags": [
     "family_debt"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "ตื่นตีห้าไปช่วยร้านในตลาดก่อนไปโรงเรียน ค่าแรงที่ได้แยกไว้ส่งดอกทุกวัน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอให้เอาเงินไปคืนเขาก่อน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [
     "cadet_family_support"
    ],
    "schedule": [],
    "result": "ที่บ้านเอาเงินไปคืนในวันนั้น เสียดอกแค่ไม่กี่วัน {ชื่อ} กลับไปอ่านหนังสือเอง",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "F1-ค",
  "title": "ที่บ้านหาเงินค่าติว",
  "ageMin": 13,
  "ageMax": 17,
  "kind": "scheduled",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2544,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_family_support",
    "fund:village_fund"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": "F1",
  "replaces": null,
  "text": "ที่บ้านรับปากจะออกค่าติวให้ {ชื่อ} {ผู้ใหญ่}จึงไปขอกู้กองทุนหมู่บ้าน มีเพื่อนบ้านสองคนช่วยค้ำ ในที่ประชุมมีคนถามว่าจะกู้ไปทำอะไร {ผู้ใหญ่}ตอบว่า 'เอาไปให้{ลูก}ติวสอบเตรียมทหารจ้ะ{ถิ่น}'",
  "options": [
   {
    "label": "รับเงินไว้ สัญญาว่าจะตั้งใจ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 1,
     "money": 0
    },
    "setFlags": [
     "family_debt"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "ไม่ทันค่ำ ทั้งหมู่บ้านรู้ว่า {ชื่อ} จะสอบเตรียมทหาร ใครเจอก็ถามว่าสอบเมื่อไร",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอไปติวค่ายใกล้บ้านที่ถูกกว่า",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "family_debt"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "ค่ายติวในอำเภอถูกกว่ามาก เงินที่เหลือเอาไปส่งคืนกองทุนงวดแรกเลย",
    "outcomes": null,
    "next": null
   },
   {
    "label": "รับจ้างช่วยส่งเงินกู้",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": -1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 1
    },
    "setFlags": [
     "family_debt"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "ปิดเทอมไปรับจ้างในไร่ข้างบ้าน ค่าแรงก้อนแรกเอาไปช่วยส่งเงินกู้งวดแรก",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอให้ยกเลิกเงินกู้ จะอ่านเอง",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [
     "cadet_family_support"
    ],
    "schedule": [],
    "result": "{ผู้ใหญ่}ไปขอถอนชื่อจากรอบนี้ คิวกู้ตกไปเป็นของบ้านถัดไป",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "F1-ค2",
  "title": "ที่บ้านหาเงินค่าติว",
  "ageMin": 13,
  "ageMax": 17,
  "kind": "scheduled",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": 2543,
   "school": null,
   "flagsHas": [
    "cadet_family_support",
    "fund:village_fund"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": "F1",
  "replaces": null,
  "text": "ที่บ้านรับปากจะออกค่าติวให้ {ชื่อ} {ผู้ใหญ่}จึงไปขอกู้สหกรณ์ที่เป็นสมาชิกอยู่ ต้องหาเพื่อนบ้านมาช่วยค้ำ เจ้าหน้าที่ถามว่าจะกู้ไปลงทุนอะไร {ผู้ใหญ่}ตอบว่า 'ลงทุนให้ลูกให้หลานได้เรียนนี่แหละ{ถิ่น}'",
  "options": [
   {
    "label": "รับเงินไว้ สัญญาว่าจะตั้งใจ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 1,
     "money": 0
    },
    "setFlags": [
     "family_debt"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "เพื่อนบ้านที่ช่วยค้ำ แวะมาถามทุกครั้งที่ผ่านหน้าบ้านว่าอ่านหนังสือไปถึงไหนแล้ว",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอไปติวค่ายใกล้บ้านที่ถูกกว่า",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "family_debt"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "ค่ายติวในอำเภอถูกกว่าเกือบครึ่ง เงินที่เหลือเอาไปคืนสหกรณ์ก่อน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "รับจ้างช่วยส่งเงินกู้",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": -1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 1
    },
    "setFlags": [
     "family_debt"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "ปิดเทอมไปรับจ้างในไร่ข้างบ้าน ค่าแรงก้อนแรกเอาไปช่วยส่งเงินกู้งวดแรก",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอให้ยกเลิกเงินกู้ จะอ่านเอง",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [
     "cadet_family_support"
    ],
    "schedule": [],
    "result": "{ผู้ใหญ่}ไปบอกเจ้าหน้าที่ว่าไม่กู้แล้ว {ชื่อ} กลับไปอ่านหนังสือเอง",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "F1-ง",
  "title": "ที่บ้านหาเงินค่าติว",
  "ageMin": 13,
  "ageMax": 17,
  "kind": "scheduled",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_family_support",
    "fund:pawn"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": "F1",
  "replaces": null,
  "text": "ที่บ้านรับปากจะออกค่าติวให้ {ชื่อ} แต่ไม่มีเงินเก็บ {ผู้ใหญ่}จึงเอาสร้อยทองเส้นเดียวของบ้านไปจำนำ แล้วบอกว่า 'เดี๋ยวขายของได้ก็ไปไถ่คืน ไม่ต้องห่วงหรอก{ถิ่น}' ใบจำนำเก็บไว้ในกล่องบนหิ้ง",
  "options": [
   {
    "label": "รับเงินไว้ สัญญาว่าจะตั้งใจ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "family_debt"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "{ชื่อ} จดวันครบกำหนดไถ่สร้อยไว้หลังสมุด เห็นทุกครั้งที่เปิดอ่านหนังสือ",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอติวค่ายถูก จะได้ไถ่สร้อยเร็ว",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "family_debt"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "เลือกค่ายติวราคาถูก เงินที่เหลือพอจ่ายดอกโรงรับจำนำไปได้อีกหลายเดือน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "รับจ้างเก็บเงินช่วยไถ่สร้อย",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": -1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 1
    },
    "setFlags": [
     "family_debt"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "ล้างจานร้านข้าวแกงทุกเย็น เงินที่ได้ใส่ซองแยกไว้ เขียนว่า 'ค่าไถ่สร้อย'",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอให้ไปไถ่สร้อยคืนก่อน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [
     "cadet_family_support"
    ],
    "schedule": [],
    "result": "สัปดาห์นั้นสร้อยกลับมาอยู่ที่บ้าน {ชื่อ} กลับไปอ่านหนังสือข้อสอบเก่าเอง",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "F1-จ",
  "title": "ที่บ้านหาเงินค่าติว",
  "ageMin": 13,
  "ageMax": 17,
  "kind": "scheduled",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_family_support",
    "fund:sell_livestock"
   ],
   "flagsNot": [],
   "family": null,
   "poor": null
  },
  "variantOf": "F1",
  "replaces": null,
  "text": "ที่บ้านรับปากจะออกค่าติวให้ {ชื่อ} {ผู้ใหญ่}จึงขายวัวสองตัวให้คนรับซื้อที่มาถึงคอก ยังไม่ถึงช่วงราคาดี เลยได้เงินน้อยกว่าที่หวังไว้ เย็นนั้นคอกหลังบ้านดูโล่งกว่าทุกวัน",
  "options": [
   {
    "label": "รับเงินไว้ สัญญาว่าจะตั้งใจ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "{ชื่อ} ตื่นมาตักน้ำให้วัวที่เหลือทุกเช้า โดยไม่ต้องมีใครบอก",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอติวค่ายถูก เหลือเงินไว้",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 1
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ค่ายติวในอำเภอถูกกว่า {ผู้ใหญ่}แบ่งเงินที่เหลือให้เก็บไว้เป็นค่ารถวันสอบ",
    "outcomes": null,
    "next": null
   },
   {
    "label": "รับจ้างเลี้ยงวัวให้บ้านอื่น",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": -1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 1
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "หลังเลิกเรียนต้อนวัวบ้านอื่นไปกินหญ้า แดดร้อนจนผิวลอก แต่ได้ค่าจ้างทุกสิ้นเดือน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอให้ซื้อวัวคืน จะอ่านเอง",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [
     "cadet_family_support"
    ],
    "schedule": [],
    "result": "คนรับซื้อไม่ยอมขายวัวคืน เงินจึงเก็บไว้ใช้ในบ้าน {ชื่อ} อ่านหนังสือเอง",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "F2",
  "title": "ที่บ้านเห็นความตั้งใจ",
  "ageMin": 13,
  "ageMax": 17,
  "kind": "scheduled",
  "weight": 1,
  "repeatable": false,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream",
    "cadet_family_told"
   ],
   "flagsNot": [
    "cadet_family_support"
   ],
   "family": null,
   "poor": null
  },
  "variantOf": null,
  "replaces": null,
  "text": "เย็นนี้{ผู้ใหญ่}เปิดดูสมุดพกของ {ชื่อ} อยู่นาน ตกดึกเห็นไฟโต๊ะอ่านหนังสือยังเปิดอยู่ จึงมาเคาะประตูแล้วบอกว่า 'เห็นอ่านหนังสือทุกคืนแบบนี้ ถ้ายังอยากเข้าค่ายติวอยู่ เดี๋ยวช่วยออกให้{ถิ่น}'",
  "options": [
   {
    "label": "รับไว้ ขอบคุณที่ช่วย",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 2,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "cadet_family_support"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "{ผู้ใหญ่}ยิ้ม 'เรื่องเงินไม่ต้องคิดแล้ว แต่นอนบ้างนะ{ถิ่น} เดี๋ยวไม่สบาย'",
    "outcomes": null,
    "next": null
   },
   {
    "label": "รับครึ่งเดียว อีกครึ่งออกเอง",
    "hint": null,
    "requiresMoney": 1,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": -1
    },
    "setFlags": [
     "cadet_family_support"
    ],
    "clearFlags": [],
    "schedule": [],
    "result": "{ผู้ใหญ่}หัวเราะ 'ดื้อขนาดนี้ ไปอยู่โรงเรียนประจำรอดแน่{ถิ่น}' ค่าติวเลยช่วยกันออกคนละครึ่ง",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอแค่ค่าหนังสือเตรียมสอบ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "วันเสาร์ไปร้านหนังสือในเมืองด้วยกัน ได้หนังสือข้อสอบเก่ากลับมาสามเล่ม ไม่ได้เข้าค่ายติว",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอบคุณ แต่ขอลองอ่านเองก่อน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "{ผู้ใหญ่}ไม่ตื๊อ แต่ก่อนปิดประตูบอกว่า 'ถ้าเปลี่ยนใจก็มาบอกล่ะ{ถิ่น}'",
    "outcomes": null,
    "next": null
   }
  ]
 }
]);

// รอบ 6 · ความรู้ระหว่างติว (K1..K6) · cond.knowledgeMax = การ์ดออกเฉพาะตอน knowledge < ค่านี้
window.DEMO_EVENTS = (window.DEMO_EVENTS || []).concat([
 {
  "id": "K1",
  "title": "คาบติวเข้มช่วงเย็น",
  "ageMin": 14,
  "ageMax": 18,
  "kind": "pool",
  "weight": 2,
  "repeatable": true,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream",
    "cadet_prep_camp"
   ],
   "flagsNot": [
    "cadet_exam_door"
   ],
   "family": null,
   "poor": null,
   "knowledgeMax": 60
  },
  "variantOf": null,
  "replaces": null,
  "text": "หกโมงเย็นในค่ายติว ครูเขียนโจทย์คณิตเต็มกระดาน แล้วบอกว่า 'ข้อแนวนี้ออกแทบทุกปี ทำตรงนี้ได้ ไปสอบจริงสบาย' ห้องเงียบจนได้ยินเสียงพัดลม {ชื่อ} ง่วงตั้งแต่คาบบ่าย",
  "options": [
   {
    "label": "จดทุกข้อ ทำตามครูจนจบ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 3,
     "health": -1,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "กลับถึงที่พักสามทุ่ม มือเปื้อนหมึก แต่โจทย์แนวนี้ทำได้คล่องขึ้นจริง",
    "outcomes": null,
    "next": null
   },
   {
    "label": "จดเฉพาะแนวที่ครูบอกว่าออกบ่อย",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 2,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "สมุดเล่มเล็กเต็มไปด้วยโจทย์ที่ครูวงไว้ เปิดทวนบนรถได้ทุกวัน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "นั่งฟังเฉย ๆ ไม่ได้จด",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "พอเข้าใจตอนครูอธิบาย แต่ถึงห้องพักก็จำได้ไม่กี่ข้อ",
    "outcomes": null,
    "next": null
   },
   {
    "label": "แอบฟุบหลับท้ายห้อง",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ตื่นมาอีกทีกระดานถูกลบแล้ว เพื่อนข้าง ๆ ส่งยิ้มให้",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "K2",
  "title": "ผลสอบย่อยในค่าย",
  "ageMin": 14,
  "ageMax": 18,
  "kind": "pool",
  "weight": 2,
  "repeatable": true,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream",
    "cadet_prep_camp"
   ],
   "flagsNot": [
    "cadet_exam_door"
   ],
   "family": null,
   "poor": null,
   "knowledgeMax": 60
  },
  "variantOf": null,
  "replaces": null,
  "text": "ค่ายติวติดประกาศผลสอบย่อยไว้หน้าห้อง ชื่อ {ชื่อ} อยู่กลางกระดาษ ครูเดินมาบอกว่า 'ที่ผิดเนี่ยแนวที่ออกบ่อยทั้งนั้น แก้ตรงนี้ได้ อันดับขึ้นอีกเยอะเลย'",
  "options": [
   {
    "label": "ไล่ทำข้อที่ผิดใหม่ทุกข้อ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 3,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ทำซ้ำจนดึก ข้อที่เคยผิดตอนนี้ทำได้เกือบหมด",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ไปถามครูข้อที่ไม่เข้าใจ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 2,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 1,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ครูจำหน้า {ชื่อ} ได้ ตั้งแต่นั้นมักเรียกให้ลองทำโจทย์หน้าห้อง",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ดูคะแนนแล้วกลับไปเรียนต่อ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "คาบต่อไปก็เรียนตามปกติ ลำดับครั้งหน้าขยับขึ้นมาเล็กน้อย",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ชวนเพื่อนค่ายไปหาของกิน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 2,
     "relations": 0,
     "network": 1,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ได้เพื่อนต่างอำเภอเพิ่มอีกหลายคน ข้อที่ผิดยังผิดอยู่เหมือนเดิม",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "K3",
  "title": "โต๊ะหลังบ้านกับเพื่อนที่มาชวน",
  "ageMin": 14,
  "ageMax": 18,
  "kind": "pool",
  "weight": 2,
  "repeatable": true,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream",
    "cadet_prep_self"
   ],
   "flagsNot": [
    "cadet_exam_door"
   ],
   "family": null,
   "poor": null,
   "knowledgeMax": 50
  },
  "variantOf": null,
  "replaces": null,
  "text": "{ชื่อ} ตั้งโต๊ะอ่านหนังสือไว้หลังบ้าน ตั้งใจว่าเย็นนี้จะทำโจทย์ให้จบบท ยังไม่ทันเปิดหนังสือ เพื่อนข้างบ้านก็มาตะโกนเรียก 'มาเตะบอลดิ ขาดอีกคนเดียวเว้ย'",
  "options": [
   {
    "label": "บอกเพื่อนว่าวันนี้ขออ่านก่อน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 2,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ได้ยินเสียงเพื่อนเล่นกันอยู่ไกล ๆ แต่โจทย์บทนี้ก็ทำจบ",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ไปเล่นแป๊บเดียวแล้วกลับมาอ่าน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "กลับมาตอนหัวค่ำ อ่านได้ครึ่งบท ดีกว่าไม่ได้อ่านเลย",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ไปเล่นก่อน ค่อยอ่านพรุ่งนี้",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 2,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เล่นจนมืด กลับมาก็ง่วง หนังสือยังเปิดค้างหน้าเดิม",
    "outcomes": null,
    "next": null
   },
   {
    "label": "เล่นจนดึก ลืมเรื่องอ่านไปเลย",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": -1,
     "health": 1,
     "happiness": 2,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "หลายวันผ่านไปไม่ได้แตะหนังสือ บทที่เคยอ่านไว้เริ่มลืม",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "K4",
  "title": "ข้อสอบเก่ามือสองในตลาด",
  "ageMin": 14,
  "ageMax": 18,
  "kind": "pool",
  "weight": 2,
  "repeatable": true,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream",
    "cadet_prep_self"
   ],
   "flagsNot": [
    "cadet_exam_door"
   ],
   "family": null,
   "poor": null,
   "knowledgeMax": 50
  },
  "variantOf": null,
  "replaces": null,
  "text": "ร้านหนังสือเก่าในตลาดมีหนังสือข้อสอบเก่าเตรียมทหารวางอยู่ เล่มมุมพับแต่ยังมีเฉลยครบ {ชื่อ} คิดว่าถ้าได้มา ต้องจัดตารางอ่านเองให้ทันก่อนวันสอบ",
  "options": [
   {
    "label": "ซื้อแล้วจัดตารางทำวันละชุด",
    "hint": null,
    "requiresMoney": 1,
    "fx": {
     "knowledge": 2,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": -1
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ตารางติดไว้ข้างฝา ขีดฆ่าไปทีละวัน บางวันก็หลุด แต่เดินหน้าได้เรื่อย ๆ",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ซื้อแล้วอ่านแค่เฉลย",
    "hint": null,
    "requiresMoney": 1,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": -1
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "จำคำตอบได้หลายข้อ แต่พอเปลี่ยนตัวเลขก็ทำไม่ได้",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ขอยืมเพื่อนไปถ่ายเอกสาร",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 1,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ได้มาครึ่งเล่ม เพื่อนขอให้ช่วยติวเลขกลับเป็นการแลกเปลี่ยน",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ไม่ซื้อ เก็บเงินไว้เที่ยว",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "เสาร์นั้นไปเที่ยวงานวัดกับเพื่อน หนังสือเล่มนั้นมีคนซื้อไปแล้ว",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "K5",
  "title": "ติวกับเพื่อนห้องสาม",
  "ageMin": 14,
  "ageMax": 18,
  "kind": "pool",
  "weight": 2,
  "repeatable": true,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream",
    "cadet_prep_group"
   ],
   "flagsNot": [
    "cadet_exam_door"
   ],
   "family": null,
   "poor": null,
   "knowledgeMax": 55
  },
  "variantOf": null,
  "replaces": null,
  "text": "เพื่อนสี่คนที่จะสอบเตรียมทหารเหมือนกัน นัดติวที่ห้องสามหลังเลิกเรียน ใครเก่งวิชาไหนก็สอนวิชานั้น วันนี้ถึงคิว {ชื่อ} ต้องอธิบายโจทย์ให้เพื่อนฟัง",
  "options": [
   {
    "label": "เตรียมโจทย์มาสอนเพื่อนอย่างดี",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 2,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 1,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "พออธิบายให้คนอื่นฟัง ตัวเองก็เข้าใจลึกขึ้นกว่าเดิม",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ตั้งใจฟังเพื่อนคนอื่นสอน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 2,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ได้วิธีคิดแบบใหม่จากเพื่อน เร็วกว่าที่อ่านเองหลายเท่า",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ติวไปคุยเล่นไป",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "หัวเราะกันจนภารโรงมาเคาะประตู ได้ความรู้กลับไปนิดหน่อย",
    "outcomes": null,
    "next": null
   },
   {
    "label": "แวบไปเตะบอลกับห้องข้าง ๆ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 2,
     "relations": 0,
     "network": -1,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "กลับมาอีกทีเพื่อนแยกย้ายกันไปแล้ว ไม่มีใครพูดถึงเรื่องนี้",
    "outcomes": null,
    "next": null
   }
  ]
 },
 {
  "id": "K6",
  "title": "รุ่นพี่ส่งโจทย์มาให้",
  "ageMin": 14,
  "ageMax": 18,
  "kind": "pool",
  "weight": 2,
  "repeatable": true,
  "cond": {
   "sex": "ชาย",
   "regions": null,
   "notRegions": null,
   "heir": null,
   "notHeir": null,
   "yearMin": 2501,
   "yearMax": null,
   "school": null,
   "flagsHas": [
    "cadet_dream",
    "cadet_prep_senior"
   ],
   "flagsNot": [
    "cadet_exam_door"
   ],
   "family": null,
   "poor": null,
   "knowledgeMax": 55
  },
  "variantOf": null,
  "replaces": null,
  "text": "รุ่นพี่ที่สอบติดเมื่อปีก่อนฝากหนังสือมาถึง {ชื่อ} ข้างในเป็นโจทย์ที่พี่คัดเอง พร้อมโน้ตตัวเล็ก ๆ ว่า 'ทำให้จบก่อนพี่ลากลับบ้านนะ เดี๋ยวพี่ตรวจให้'",
  "options": [
   {
    "label": "ทำครบทุกข้อ รอพี่มาตรวจ",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 3,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "พี่ตรวจแล้ววงข้อผิดไว้ไม่กี่ข้อ บอกว่าแบบนี้มีลุ้น",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ทำเฉพาะวิชาที่ยังอ่อน",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 2,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "วิชาที่เคยกลัวเริ่มทำได้ ส่วนวิชาที่ถนัดก็ยังพอไปได้",
    "outcomes": null,
    "next": null
   },
   {
    "label": "ทำครึ่งเดียว ที่เหลือดูเฉลย",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "พี่ดูแล้วรู้ทันที แต่ไม่ว่าอะไร แค่บอกให้ลองทำเองครั้งหน้า",
    "outcomes": null,
    "next": null
   },
   {
    "label": "วางไว้ก่อน ช่วงนี้ขอพัก",
    "hint": null,
    "requiresMoney": 0,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 2,
     "relations": 0,
     "network": -1,
     "money": 0
    },
    "setFlags": [],
    "clearFlags": [],
    "schedule": [],
    "result": "ปิดภาคพี่กลับมาถามถึงโจทย์ {ชื่อ} ได้แต่ยิ้มแห้ง",
    "outcomes": null,
    "next": null
   }
  ]
 }
]);
