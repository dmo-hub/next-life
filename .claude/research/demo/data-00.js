// demo data · normal everyday life events (age 10-18) · converted from content/*.yaml cards
// sources: teen.yaml, risky_cases.yaml, milestones_stages.yaml, belief.yaml, stats_extremes.yaml, pets.yaml, child_family.yaml, childhood_echoes.yaml, time_capsule.yaml, child_health.yaml
window.DEMO_EVENTS = (window.DEMO_EVENTS || []).concat([
 {
  "id": "N-teen_entrance_exam_01",
  "title": "สนามสอบเข้า",
  "ageMin": 17,
  "ageMax": 18,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": [
    "upper"
   ],
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "สนามสอบเข้ามาถึงแล้ว เพื่อนทั้งห้องลงคอร์สติวกันหมด",
  "options": [
   {
    "label": "ลงคอร์สติวหนักจนตาลาย",
    "hint": null,
    "fx": {
     "knowledge": 3,
     "health": -1,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": -1
    },
    "setFlags": [
     "good_student"
    ],
    "result": "ติวหนักทุกเย็นจนตาลาย แต่เนื้อหาแน่นขึ้นเยอะ",
    "outcomes": null
   },
   {
    "label": "ไม่อ่าน ฝนตามดวงเอา",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.25,
      "result": "ติดคณะดังแบบงง ๆ ทั้งโรงเรียนแตกตื่น",
      "fx": {
       "knowledge": 1,
       "health": 0,
       "happiness": 3,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "good_student"
      ]
     },
     {
      "p": 0.75,
      "result": "ฝนผิดแถวตั้งแต่ข้อแรก รู้ตัวตอนหมดเวลา",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -2,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   },
   {
    "label": "ไม่สอบ ไปเรียนสายอาชีพ",
    "hint": null,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "เลือกเรียนสายอาชีพ ได้ลงมือทำจริงตั้งแต่ปีแรก",
    "outcomes": null
   },
   {
    "label": "ติวเองกับเพื่อนสนิท",
    "hint": null,
    "fx": {
     "knowledge": 2,
     "health": 1,
     "happiness": 0,
     "relations": 2,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ติวกับเพื่อนสนิททุกเย็น ได้ทั้งความรู้และเพื่อน",
    "outcomes": null
   },
   {
    "label": "อ่านหนัก แล้วไหว้พระก่อนสอบ",
    "hint": null,
    "fx": {
     "knowledge": 3,
     "health": -1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": -1
    },
    "setFlags": [
     "good_student"
    ],
    "result": "อ่านหนังสือหนักแล้วไปไหว้พระก่อนสอบ ใจนิ่งขึ้น",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-teen_gaming_01",
  "title": "ศึกร้านเกม",
  "ageMin": 13,
  "ageMax": 18,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": [
    "lower",
    "upper",
    "voc"
   ],
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "ร้านเกมหน้าโรงเรียนเปิดศึกแข่งทีม เงินรางวัลเท่าค่าเทอมทั้งปี ทีมเพื่อนขาดอีกคนเดียว ทุกคนหันมาเรียก '{ชื่อ} ลงด้วยกันเถอะ'",
  "options": [
   {
    "label": "โดดเรียนไปซ้อมทั้งเดือน",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.25,
      "result": "ทีมคว้าแชมป์ แมวมองทีมอีสปอร์ตมาขอเบอร์ถึงที่",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 3,
       "relations": 0,
       "network": 0,
       "money": 2
      },
      "setFlags": [
       "esports_scouted"
      ]
     },
     {
      "p": 0.75,
      "result": "ตกรอบแรก แถมครูโทรหาที่บ้านเรื่องขาดเรียน",
      "fx": {
       "knowledge": -2,
       "health": 0,
       "happiness": 0,
       "relations": -1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   },
   {
    "label": "เล่นแค่เสาร์อาทิตย์",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "เล่นกับเพื่อนแค่เสาร์อาทิตย์ ไม่เสียการเรียน",
    "outcomes": null
   },
   {
    "label": "เลิกเกม ไปเข้าชมรมบาส",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 2,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "sporty"
    ],
    "result": "ย้ายไปเข้าชมรมบาส ร่างกายแข็งแรงขึ้น",
    "outcomes": null
   },
   {
    "label": "เล่นยันตีสามทุกคืน",
    "hint": null,
    "fx": {
     "knowledge": -1,
     "health": -2,
     "happiness": 2,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "เล่นยันตีสามทุกคืน ตื่นไปโรงเรียนแทบไม่ไหว",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-teen_esports_scout_01",
  "title": "สัญญาจากแมวมอง",
  "ageMin": 13,
  "ageMax": 18,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": [
    "lower",
    "upper",
    "voc"
   ],
   "flagsHas": [
    "esports_scouted"
   ],
   "flagsNot": [],
   "classes": null
  },
  "text": "แมวมองยื่นสัญญาเข้าบ้านทีม กินนอนซ้อมวันละสิบสองชั่วโมง มีเงินเดือนให้ แต่ต้องพักการเรียนทันที ที่บ้านยังไม่รู้เรื่องนี้เลย",
  "options": [
   {
    "label": "เซ็นเลย ทิ้งห้องเรียน",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.33,
      "result": "ทีมติดลีกใหญ่ ชื่อคุณขึ้นจอยักษ์กลางห้าง",
      "fx": {
       "knowledge": -2,
       "health": 0,
       "happiness": 3,
       "relations": 0,
       "network": 0,
       "money": 2
      },
      "setFlags": []
     },
     {
      "p": 0.67,
      "result": "ทีมยุบหลังสามเดือน กลับบ้านมือเปล่าแถมซ้ำชั้น",
      "fx": {
       "knowledge": -2,
       "health": 0,
       "happiness": -2,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   },
   {
    "label": "ขอทุนนักกีฬาอีสปอร์ตแทน",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "ได้โควตาทุนนักกีฬาเต็มจำนวนไว้ใช้ตอนเข้ามหาวิทยาลัย เรียนไปแข่งไป ไม่ต้องจ่ายค่าเทอมสักบาท",
      "fx": {
       "knowledge": 1,
       "health": 0,
       "happiness": 2,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "scholarship"
      ]
     },
     {
      "p": 0.5,
      "result": "โควตาทุนเต็มแล้ว ได้เสื้อทีมกลับบ้านมาตัวเดียว",
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
    ]
   },
   {
    "label": "พาแมวมองไปคุยกับพ่อแม่",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "พ่อแม่ยอมให้ลองหนึ่งปี ขอแค่เกรดห้ามตก",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 1,
       "relations": 2,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "ที่บ้านไล่แมวมองออกจากบ้าน แล้วยกคอมไปขายทิ้งต่อหน้า",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -2,
       "relations": -1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   },
   {
    "label": "ปฏิเสธ กลับไปตั้งใจเรียน",
    "hint": null,
    "fx": {
     "knowledge": 2,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ปฏิเสธแมวมอง กลับไปตั้งใจเรียน",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-teen_first_smoke_01",
  "title": "บุหรี่มวนแรก",
  "ageMin": 13,
  "ageMax": 18,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": "ชาย",
   "school": [
    "lower",
    "upper",
    "voc"
   ],
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "หลังเลิกเรียน รุ่นพี่ยื่นบุหรี่มวนหนึ่งมาให้ ทั้งวงเงียบกริบ จ้องรอดูว่าจะกล้าสูบไหม",
  "options": [
   {
    "label": "สูบโชว์ให้ดูเท่",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": -1,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "smoker"
    ],
    "result": "สูบโชว์ได้ไม่สำลัก ทั้งวงยอมรับเข้ากลุ่ม",
    "outcomes": null
   },
   {
    "label": "ลองสูบ แล้วสำลักหนัก",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.67,
      "result": "ไอจนน้ำตาไหล ทั้งวงหัวเราะ แต่ไม่มีใครชวนอีกเลย",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.33,
      "result": "สำลักแต่ฝืนสูบต่อทุกวันจนติดงอมแงม",
      "fx": {
       "knowledge": 0,
       "health": -1,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "smoker"
      ]
     }
    ]
   },
   {
    "label": "ปฏิเสธแล้วเดินหนี",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.67,
      "result": "รุ่นพี่ยักไหล่ ไม่ว่าอะไร",
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
      "p": 0.33,
      "result": "รุ่นพี่ล้อว่าลูกแหง่ไปทั้งเทอม",
      "fx": {
       "knowledge": 0,
       "health": 1,
       "happiness": -2,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "bullied"
      ]
     }
    ]
   },
   {
    "label": "แอบบอกครูฝ่ายปกครอง",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "ครูจับได้คาหนังคาเขา ไม่มีใครรู้ว่าใครบอก",
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
      "result": "ความแตกว่าใครฟ้อง ทั้งสายชั้นเลิกคุยด้วย",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -1,
       "relations": -2,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "bullied"
      ]
     }
    ]
   }
  ]
 },
 {
  "id": "N-teen_first_love_01",
  "title": "จดหมายใต้โต๊ะ",
  "ageMin": 14,
  "ageMax": 18,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": [
    "lower",
    "upper",
    "voc"
   ],
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "มีจดหมายสอดไว้ใต้โต๊ะ ลงท้ายว่า 'ชอบมานานแล้ว' ลายมือคุ้นตาเหมือนของเพื่อนสนิทที่สุดของคุณ",
  "options": [
   {
    "label": "ตอบตกลงทันที",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.67,
      "result": "รักแรกหวานฉ่ำ เกรดร่วงพร้อมกันทั้งคู่",
      "fx": {
       "knowledge": -1,
       "health": 0,
       "happiness": 3,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.33,
      "result": "ที่แท้เพื่อนในห้องแกล้งเขียน ทั้งห้องหัวเราะลั่น",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -2,
       "relations": -1,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "bullied"
      ]
     }
    ]
   },
   {
    "label": "ปฏิเสธเพื่อรักษาเพื่อน",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "เพื่อนเงียบหายไปทั้งเทอม",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": -2,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "เพื่อนขอบคุณที่จริงใจ กลายเป็นเพื่อนกันตลอดชีวิต",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 1,
       "relations": 2,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   },
   {
    "label": "แอบคบ ไม่ให้ที่บ้านรู้",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.67,
      "result": "แอบเจอกันหลังเลิกเรียนทุกวัน ที่บ้านไม่เคยรู้",
      "fx": {
       "knowledge": -1,
       "health": 0,
       "happiness": 2,
       "relations": -1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.33,
      "result": "ที่บ้านจับได้ สั่งให้เลิกต่อหน้า คุณเลือกที่บ้าน เขาด่าคุณกลางโรงเรียนแล้วไม่พูดด้วยอีกเลย",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -2,
       "relations": -1,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "ex_bitter"
      ]
     }
    ]
   },
   {
    "label": "ขอเรียนให้จบก่อนนะ",
    "hint": null,
    "fx": {
     "knowledge": 2,
     "health": 1,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "บอกเขาว่าขอเรียนให้จบก่อน แล้วกลับไปตั้งใจอ่านหนังสือ",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-teen_viral_clip_01",
  "title": "คลิปเต้นดังข้ามคืน",
  "ageMin": 13,
  "ageMax": 18,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {"yearMin": 2557, 
   "sex": null,
   "school": [
    "lower",
    "upper",
    "voc"
   ],
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "คลิปเต้นที่ถ่ายเล่นในห้องเรียนยอดวิวทะลุแสน แบรนด์ทักมาขอจ้างรีวิว ส่วนครูประจำชั้นก็เพิ่งเห็นคลิปเหมือนกัน",
  "options": [
   {
    "label": "รับงานรีวิวเต็มตัว",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.67,
      "result": "ค่ารีวิวเดือนเดียวเท่าค่าขนมทั้งปี",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 1,
       "relations": 0,
       "network": 0,
       "money": 2
      },
      "setFlags": [
       "likes_clips"
      ]
     },
     {
      "p": 0.33,
      "result": "ของที่รีวิวเป็นของปลอม คนแห่ด่าทั้งเน็ต",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -2,
       "relations": -1,
       "network": 0,
       "money": 2
      },
      "setFlags": [
       "likes_clips"
      ]
     }
    ]
   },
   {
    "label": "ถ่ายคลิปทุกวันจนดึก",
    "hint": null,
    "fx": {
     "knowledge": 1,
     "health": -1,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "likes_clips"
    ],
    "result": "ถ่ายคลิปทุกคืนจนดึก ฝีมือตัดต่อดีขึ้นเรื่อย ๆ",
    "outcomes": null
   },
   {
    "label": "ลบคลิป กลับไปอ่านหนังสือ",
    "hint": null,
    "fx": {
     "knowledge": 2,
     "health": 1,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "good_student"
    ],
    "result": "ลบคลิปทิ้ง แล้วกลับไปตั้งใจอ่านหนังสือ",
    "outcomes": null
   },
   {
    "label": "ชวนครูมาเต้นคลิปต่อ",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "คลิปครูเต้นดังกว่าเดิมสิบเท่า ทั้งโรงเรียนรักครูขึ้น",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 2,
       "relations": 2,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "likes_clips"
      ]
     },
     {
      "p": 0.5,
      "result": "ครูโดนผู้บริหารเรียกพบ ไม่มองหน้ากันอีกเลย",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": -2,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   }
  ]
 },
 {
  "id": "N-teen_part_time_01",
  "title": "หาเงินเองครั้งแรก",
  "ageMin": 15,
  "ageMax": 18,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": null,
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "ที่บ้านเงินเริ่มตึง ร้านหมูกระทะข้างตลาดรับเด็กล้างจาน ส่วนเพื่อนชวนไปแบกของที่ท่าเรือ ได้เงินมากกว่าเท่าตัว",
  "options": [
   {
    "label": "ล้างจาน เอาเงินช่วยบ้าน",
    "hint": null,
    "fx": {
     "knowledge": -1,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 1
    },
    "setFlags": [],
    "result": "ล้างจานทุกเย็น เอาเงินมาช่วยบ้าน",
    "outcomes": null
   },
   {
    "label": "ไปแบกของที่ท่าเรือ",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.75,
      "result": "ได้เงินดี กล้ามขึ้นเป็นมัด",
      "fx": {
       "knowledge": 0,
       "health": 1,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 2
      },
      "setFlags": [
       "sporty"
      ]
     },
     {
      "p": 0.25,
      "result": "ลังหล่นทับหลัง นอนซมไปหลายเดือน",
      "fx": {
       "knowledge": 0,
       "health": -2,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 1
      },
      "setFlags": []
     }
    ]
   },
   {
    "label": "ขายเคสมือถือออนไลน์",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.33,
      "result": "ขายดีจนต้องจ้างเพื่อนช่วยแพ็กของ",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 2
      },
      "setFlags": []
     },
     {
      "p": 0.67,
      "result": "ของค้างสต็อกเต็มห้องนอน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": -1
      },
      "setFlags": [
       "case_stock"
      ]
     }
    ]
   },
   {
    "label": "ไม่ทำ ตั้งใจเรียนชิงทุน",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.33,
      "result": "ได้ทุนเรียนฟรีถึงปริญญาตรี",
      "fx": {
       "knowledge": 2,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 2
      },
      "setFlags": [
       "good_student",
       "scholarship"
      ]
     },
     {
      "p": 0.67,
      "result": "ทุนตกไปที่คนอื่นแค่คะแนนเดียว",
      "fx": {
       "knowledge": 1,
       "health": 0,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   }
  ]
 },
 {
  "id": "N-teen_case_stock_01",
  "title": "เคสรุ่นเก่า",
  "ageMin": 15,
  "ageMax": 18,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": null,
   "flagsHas": [
    "case_stock"
   ],
   "flagsNot": [],
   "classes": null
  },
  "text": "มือถือรุ่นใหม่ออกมาแล้ว เคสสามร้อยชิ้นใต้เตียงกลายเป็นรุ่นเก่าในคืนเดียว ที่บ้านเริ่มบ่นว่าห้องเดินไม่ได้",
  "options": [
   {
    "label": "ไปเปิดท้ายขายล้างสต็อก",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.67,
      "result": "ตะโกนขายสามเสาร์ติดกัน ได้ทุนคืนเกือบหมด แถมจำวิธีต่อราคาได้ติดตัว",
      "fx": {
       "knowledge": 1,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 1
      },
      "setFlags": []
     },
     {
      "p": 0.33,
      "result": "ขายได้ไม่ถึงสิบชิ้น ตากแดดจนหน้าไหม้",
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
    ]
   },
   {
    "label": "แจกเพื่อนทั้งห้อง",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 2,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "แจกเคสให้เพื่อนทั้งห้อง ได้ชื่อว่าใจดี",
    "outcomes": null
   },
   {
    "label": "ขายยกล็อตให้ร้านมือถือ",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.33,
      "result": "เจ้าของร้านรับไปหมดในราคาทุน แล้วชวนมาช่วยร้านวันหยุด",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 1,
       "money": 1
      },
      "setFlags": []
     },
     {
      "p": 0.67,
      "result": "ร้านกดราคาเหลือชิ้นละไม่กี่บาท ได้เงินไม่พอค่ารถไปส่ง",
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
    ]
   },
   {
    "label": "เก็บไว้ใต้เตียงต่อ",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "เก็บกล่องเคสไว้ใต้เตียงต่อ ที่บ้านบ่นทุกวัน",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-teen_moto_crash_01",
  "title": "ไถลกลางทางกลับจากงานวัด",
  "ageMin": 15,
  "ageMax": 18,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": null,
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "ซ้อนมอเตอร์ไซค์เพื่อนกลับจากงานวัด ไม่มีใครใส่หมวก รถเสียหลักไถลข้างทาง ขาบวมเป่ง ส่วนเพื่อนที่ขับหายไปไหนไม่รู้",
  "options": [
   {
    "label": "โบกรถไปโรงพยาบาลทันที",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": -1
    },
    "setFlags": [],
    "result": "หมอเข้าเฝือกให้ ต้องจ่ายค่ารักษาเอง",
    "outcomes": null
   },
   {
    "label": "ไปหาหมอนวดพื้นบ้าน",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.33,
      "result": "นวดไม่กี่ครั้งก็เดินฉิว ประหยัดไปเยอะ",
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
      "p": 0.67,
      "result": "กระดูกติดผิดรูป เดินกะเผลกไปอีกนาน",
      "fx": {
       "knowledge": 0,
       "health": -2,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   },
   {
    "label": "ลากขาไปตามหาเพื่อนก่อน",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "เจอเพื่อนสลบในคูน้ำ คุณช่วยชีวิตเขาไว้ได้ทัน",
      "fx": {
       "knowledge": 0,
       "health": -1,
       "happiness": 0,
       "relations": 3,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "เพื่อนหนีกลับบ้านไปแล้ว ทิ้งให้นอนเจ็บคนเดียว",
      "fx": {
       "knowledge": 0,
       "health": -1,
       "happiness": 0,
       "relations": -2,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   },
   {
    "label": "โทรให้ที่บ้านมารับ",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.67,
      "result": "โดนด่ายับ แต่ที่บ้านพาไปรักษาจนหายดี",
      "fx": {
       "knowledge": 0,
       "health": 1,
       "happiness": -1,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.33,
      "result": "ที่บ้านยึดทั้งรถทั้งมือถือไปทั้งปี",
      "fx": {
       "knowledge": 0,
       "health": 1,
       "happiness": -2,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   }
  ]
 },
 {
  "id": "N-teen_risky_answers_01",
  "title": "เฉลยจากรุ่นพี่",
  "ageMin": 15,
  "ageMax": 18,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": [
    "lower",
    "upper",
    "voc"
   ],
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "คืนก่อนสอบปลายภาค รุ่นพี่ในกลุ่มขายเฉลยวิชาที่คุณตกแน่ถ้าไม่มีมัน ราคาเท่าค่าขนมสองอาทิตย์ เพื่อนครึ่งห้องซื้อไปแล้ว",
  "options": [
   {
    "label": "ซื้อเฉลยจากรุ่นพี่",
    "hint": null,
    "fx": {
     "knowledge": -1,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": -1
    },
    "setFlags": [],
    "result": "คะแนนวิชานั้นผ่านฉลุย ไม่มีใครถามอะไรสักคำ",
    "outcomes": null
   },
   {
    "label": "อ่านเองทั้งคืน",
    "hint": null,
    "fx": {
     "knowledge": 1,
     "health": -1,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "อ่านเองทั้งคืนจนตาแดง แต่สอบผ่านด้วยตัวเอง",
    "outcomes": null
   },
   {
    "label": "ขอติวจากเพื่อนที่เก่ง",
    "hint": null,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "เพื่อนที่เก่งติวให้จนเข้าใจ แม้จะเหนื่อยหน่อย",
    "outcomes": null
   },
   {
    "label": "ยอมตก ไปสอบซ่อม",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ยอมตก ไปสอบซ่อมเทอมหน้า",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-milestone_teen_crossroad",
  "title": "ทางแยกวัยรุ่น",
  "ageMin": 15,
  "ageMax": 16,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": null,
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "ผู้ใหญ่ในบ้านเริ่มถามจริงจังว่าโตขึ้นจะเอายังไงกับชีวิต ต่างคนต่างมีคำแนะนำของตัวเอง",
  "options": [
   {
    "label": "ตั้งใจหาความรู้ใส่ตัวให้มาก",
    "hint": null,
    "fx": {
     "knowledge": 2,
     "health": -1,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ตั้งใจหาความรู้ใส่ตัว อ่านหนังสือทุกคืน",
    "outcomes": null
   },
   {
    "label": "หางานพิเศษเก็บเงินไว้เอง",
    "hint": null,
    "fx": {
     "knowledge": -1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 1,
     "money": 1
    },
    "setFlags": [],
    "result": "หางานพิเศษเก็บเงินเอง ได้รู้จักคนเพิ่ม",
    "outcomes": null
   },
   {
    "label": "ฝากตัวฝึกวิชากับช่างในชุมชน",
    "hint": null,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 1,
     "money": 0
    },
    "setFlags": [],
    "result": "ฝากตัวฝึกวิชากับช่างในชุมชน มือเริ่มคล่อง",
    "outcomes": null
   },
   {
    "label": "ยังไม่รู้ ขอเที่ยวกับเพื่อนก่อน",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 2,
     "relations": -1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ขอเที่ยวกับเพื่อนก่อน ค่อยคิดทีหลัง",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-bel_vow_exam",
  "title": "ศาลเจ้าก่อนสอบ",
  "ageMin": 17,
  "ageMax": 18,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": ["upper"],
   "flagsHas": [],
   "flagsNot": ["cadet_dream"],
   "classes": null
  },
  "text": "พรุ่งนี้สอบเข้ามหาวิทยาลัย {ผู้ใหญ่}พาไปไหว้ศาลเจ้าประจำเมือง คนข้างหน้าจุดประทัดแก้บนดังสนั่นจนสะดุ้ง",
  "options": [
   {
    "label": "บนบานขอให้สอบติด",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "vow_exam"
    ],
    "result": "บนบานขอให้สอบติด ใจชื้นขึ้นมาหน่อย",
    "outcomes": null
   },
   {
    "label": "ไหว้ขอพรเฉย ๆ",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ไหว้ขอพรเฉย ๆ แล้วกลับบ้านไปนอนเร็ว",
    "outcomes": null
   },
   {
    "label": "ไหว้แล้วหยอดตู้บริจาค",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ไหว้แล้วหยอดตู้บริจาค รู้สึกสบายใจ",
    "outcomes": null
   },
   {
    "label": "รออยู่ข้างนอก ไม่เข้าไปไหว้",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "รออยู่ข้างนอก มองควันธูปลอยขึ้นฟ้า",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-stats_high_knowledge_01",
  "title": "จดหมายจากกองทุน",
  "ageMin": 17,
  "ageMax": 18,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": null,
   "flagsHas": [
    "good_student"
   ],
   "flagsNot": ["cadet_dream"],
   "classes": null
  },
  "text": "ครูแนะแนวส่งชื่อคุณเข้าชิงทุนเรียนมหาวิทยาลัยเต็มจำนวนโดยไม่บอกก่อน จดหมายแจ้งว่าผ่านรอบเอกสารแล้ว เหลือสอบสัมภาษณ์รอบเดียว แต่ทุนมีเงื่อนไขต้องกลับมาใช้ทุนหลายปี",
  "options": [
   {
    "label": "ไปสัมภาษณ์ เอาทุนให้ได้",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.67,
      "result": "ได้ทุน ค่าเทอมกับค่าหอครบจนจบปริญญา",
      "fx": {
       "knowledge": 3,
       "health": 0,
       "happiness": 2,
       "relations": 0,
       "network": 2,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.33,
      "result": "ตกรอบสัมภาษณ์ กรรมการเลือกคนที่มีผลงานวิจัยมากกว่า",
      "fx": {
       "knowledge": 1,
       "health": 0,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   },
   {
    "label": "ถอนตัว ให้เพื่อนที่จนกว่าได้",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 3,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ถอนตัว ให้เพื่อนที่จนกว่าได้ทุนไป",
    "outcomes": null
   },
   {
    "label": "ขอสอบเข้าเองด้วยคะแนนล้วน",
    "hint": null,
    "fx": {
     "knowledge": 2,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "สอบเข้าเองด้วยคะแนนล้วน ไม่ติดเงื่อนไขใช้ทุน",
    "outcomes": null
   },
   {
    "label": "เรียนมหาวิทยาลัยใกล้บ้าน",
    "hint": null,
    "fx": {
     "knowledge": 2,
     "health": 0,
     "happiness": 0,
     "relations": 2,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "เลือกเรียนมหาวิทยาลัยใกล้บ้าน ได้อยู่ใกล้ครอบครัว",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-pet_kitten_gift_01",
  "title": "เพื่อนแจกลูกแมว",
  "ageMin": 13,
  "ageMax": 18,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": null,
   "flagsHas": [],
   "flagsNot": [
    "has_pet"
   ],
   "classes": null
  },
  "text": "แมวที่ห้องเพื่อนออกลูกห้าตัว เพื่อนส่งรูปมาในแชท '{ชื่อ} เอาไปสักตัวนะ ตัวสีส้มติดคนสุด' ห้องที่อยู่ตอนนี้ก็พอมีมุมให้วางกระบะทราย",
  "options": [
   {
    "label": "รับตัวสีส้มมาเลี้ยง",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 2,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "has_pet"
    ],
    "result": "รับลูกแมวสีส้มมาเลี้ยง ห้องมีชีวิตชีวาขึ้น",
    "outcomes": null
   },
   {
    "label": "ขอผ่าน ยังดูแลตัวเองไม่ไหว",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "บอกเพื่อนว่าขอผ่านไปก่อน",
    "outcomes": null
   },
   {
    "label": "ขอตัวที่ขี้อายที่สุดในครอก",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "has_pet"
    ],
    "result": "รับตัวที่ขี้อายที่สุดมาเลี้ยง ไม่กี่วันก็มานอนตัก",
    "outcomes": null
   },
   {
    "label": "ช่วยเพื่อนหาบ้านให้ทั้งครอก",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 2,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ช่วยเพื่อนโพสต์หาบ้านจนลูกแมวได้บ้านครบทั้งครอก",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-pet_stray_kid_01",
  "title": "หมาหลงมาหน้าบ้าน",
  "ageMin": 10,
  "ageMax": 14,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": null,
   "flagsHas": [],
   "flagsNot": [
    "has_pet"
   ],
   "classes": null
  },
  "text": "ลูกหมาผอมโซเดินตามคุณกลับจากตลาดจนถึงหน้าบ้าน นั่งกระดิกหางอยู่หน้าประตูไม่ยอมไปไหน {ผู้ใหญ่}ยืนกอดอกมองอยู่ที่ชาน",
  "options": [
   {
    "label": "อ้อนที่บ้านขอเลี้ยง",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 2,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "has_pet"
    ],
    "result": "ที่บ้านยอมให้เลี้ยง ลูกหมาได้บ้านใหม่",
    "outcomes": null
   },
   {
    "label": "แบ่งข้าวให้กินแล้วไล่ไป",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "แบ่งข้าวให้กินแล้วไล่ไป มันหันกลับมามองหลายรอบ",
    "outcomes": null
   },
   {
    "label": "ปิดประตูไม่สนใจ",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ปิดประตู พอเช้ามาลูกหมาก็หายไปแล้ว",
    "outcomes": null
   },
   {
    "label": "ไปถามข้างบ้านว่าของใคร",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ถามข้างบ้านจนเจอเจ้าของ เขาขอบคุณใหญ่",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-kid_clips_01",
  "title": "ผู้กำกับตัวจิ๋ว",
  "ageMin": 10,
  "ageMax": 12,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": null,
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "แอบยืมโทรศัพท์แม่ไปถ่ายแมวเต้น ตัดต่อใส่เพลงเองจนตีหนึ่ง เช้ามาพ่อแม่เจอคลิปเต็มเครื่อง ถามว่าจะเอายังไงกับเรื่องนี้",
  "options": [
   {
    "label": "เก็บค่าขนมซื้อมือถือมือสองเอง",
    "hint": null,
    "fx": {
     "knowledge": 1,
     "health": -1,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": -1
    },
    "setFlags": [
     "likes_clips"
    ],
    "result": "เก็บค่าขนมจนได้มือถือมือสองมาตัดต่อคลิปเอง",
    "outcomes": null
   },
   {
    "label": "คืนโทรศัพท์แม่ ออกไปวิ่งเล่น",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "คืนโทรศัพท์แล้วออกไปวิ่งเล่นกับเพื่อน",
    "outcomes": null
   },
   {
    "label": "แอบโพสต์คลิปแมวลงเน็ต",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.25,
      "result": "คลิปแมวเต้นยอดวิวทะลุล้าน คนทั้งซอยจำหน้าได้",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 3,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "likes_clips"
      ]
     },
     {
      "p": 0.75,
      "result": "มีคนดูเจ็ดคน หกคนคือญาติ",
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
    ]
   },
   {
    "label": "ขอแม่ไปเรียนวาดรูปแทน",
    "hint": null,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": -1
    },
    "setFlags": [],
    "result": "ได้ไปเรียนวาดรูปทุกวันเสาร์",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-kid_tutor_01",
  "title": "คอร์สกวดวิชาสุดสัปดาห์",
  "ageMin": 10,
  "ageMax": 12,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": [
    "primary",
    "lower"
   ],
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "เพื่อนร่วมห้องทุกคนเรียนพิเศษ เสาร์อาทิตย์หายไปหมด ครูประจำชั้นบอกที่บ้านว่า '{ชื่อ}หัวไว แต่ขี้เกียจ'",
  "options": [
   {
    "label": "ขอเรียนพิเศษเหมือนเพื่อนทุกคน",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": -2
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.67,
      "result": "คะแนนพุ่งติดอันดับต้นของชั้น",
      "fx": {
       "knowledge": 3,
       "health": 0,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "good_student"
      ]
     },
     {
      "p": 0.33,
      "result": "เรียนหนักจนป่วยบ่อย เกลียดหนังสือไปเลย",
      "fx": {
       "knowledge": 0,
       "health": -2,
       "happiness": -2,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   },
   {
    "label": "นั่งทำการบ้านกับคนที่บ้านทุกคืน",
    "hint": null,
    "fx": {
     "knowledge": 2,
     "health": 0,
     "happiness": -1,
     "relations": 2,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "good_student"
    ],
    "result": "ทำการบ้านกับคนที่บ้านทุกคืน คะแนนดีขึ้นทุกวิชา",
    "outcomes": null
   },
   {
    "label": "เสาร์อาทิตย์ขอเล่นเต็มที่",
    "hint": null,
    "fx": {
     "knowledge": -1,
     "health": 1,
     "happiness": 2,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "เสาร์อาทิตย์ได้เล่นเต็มที่ ตัวดำแต่แข็งแรง",
    "outcomes": null
   },
   {
    "label": "ไปช่วยที่บ้านขายของแทน",
    "hint": null,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 1
    },
    "setFlags": [],
    "result": "ไปช่วยที่บ้านขายของ ได้ค่าขนมเพิ่มและคิดเลขคล่องขึ้น",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-kid_sport_01",
  "title": "แมวมองข้างสนาม",
  "ageMin": 10,
  "ageMax": 12,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": [
    "primary",
    "lower"
   ],
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "โค้ชประจำอำเภอเห็นคุณวิ่งไล่หมาทั้งสนามโรงเรียน เลยมาชวนเข้าทีมกีฬา ซ้อมทุกเย็นหกโมงถึงสองทุ่ม",
  "options": [
   {
    "label": "เข้าทีม ซ้อมจริงจังทุกเย็น",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.75,
      "result": "ได้เหรียญทองระดับจังหวัด ร่างกายแข็งแรงขึ้นทุกปี",
      "fx": {
       "knowledge": 0,
       "health": 2,
       "happiness": 2,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "sporty",
       "medal"
      ]
     },
     {
      "p": 0.25,
      "result": "ล้มเข่าพลิกกลางสนาม ต้องเข้าเฝือกครึ่งปี",
      "fx": {
       "knowledge": 0,
       "health": -3,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   },
   {
    "label": "เล่นแค่สนุก ๆ กับเพื่อนตอนเย็น",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "sporty"
    ],
    "result": "เล่นกีฬากับเพื่อนทุกเย็น สนุกและแข็งแรง",
    "outcomes": null
   },
   {
    "label": "ปฏิเสธโค้ช กลัวเรียนไม่ทันเพื่อน",
    "hint": null,
    "fx": {
     "knowledge": 1,
     "health": -1,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ปฏิเสธโค้ชไป แล้วกลับไปนั่งอ่านหนังสือ",
    "outcomes": null
   },
   {
    "label": "อาสาช่วยโค้ชเก็บอุปกรณ์",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 2,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ช่วยโค้ชเก็บอุปกรณ์ทุกเย็น จนโค้ชเอ็นดู",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-kid_sport_school_01",
  "title": "จดหมายจากโรงเรียนกีฬา",
  "ageMin": 10,
  "ageMax": 13,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": [
    "primary",
    "lower"
   ],
   "flagsHas": [
    "medal"
   ],
   "flagsNot": [],
   "classes": null
  },
  "text": "สองวันหลังได้เหรียญ โรงเรียนกีฬาประจำจังหวัดส่งจดหมายมาชวนเข้าเรียนประจำ กินนอนที่หอ ค่าเทอมครึ่งหนึ่ง แต่ได้กลับบ้านเดือนละครั้ง",
  "options": [
   {
    "label": "ไปอยู่หอโรงเรียนกีฬา",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": -1
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.67,
      "result": "ซ้อมหนักทุกเช้า ติดทีมเยาวชนเขต ครูโค้ชเขียนชื่อไว้บนกระดานดาวรุ่ง",
      "fx": {
       "knowledge": 0,
       "health": 2,
       "happiness": 1,
       "relations": -1,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "sporty"
      ]
     },
     {
      "p": 0.33,
      "result": "คิดถึงบ้านจนร้องไห้ทุกคืน ครบเทอมก็ขอย้ายกลับ เงินค่าเทอมไม่ได้คืน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -2,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   },
   {
    "label": "เรียนที่เดิม ซ้อมกับโค้ชอำเภอ",
    "hint": null,
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
    "result": "ซ้อมกับโค้ชอำเภอต่อ ได้อยู่ใกล้บ้าน",
    "outcomes": null
   },
   {
    "label": "เอาเหรียญแขวนผนัง พอแค่นี้",
    "hint": null,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "แขวนเหรียญไว้บนผนัง แล้วกลับไปเรียนตามปกติ",
    "outcomes": null
   },
   {
    "label": "สอนน้อง ๆ ในซอยวิ่งด้วย",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 2,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "sporty"
    ],
    "result": "พาน้อง ๆ ในซอยวิ่งทุกเย็น ทั้งซอยคึกคัก",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-kid_bullied_01",
  "title": "กล่องข้าวหายอีกแล้ว",
  "ageMin": 10,
  "ageMax": 12,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": [
    "primary",
    "lower"
   ],
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "กล่องข้าวของคุณหายเป็นวันที่สาม แขนมีรอยช้ำจากเด็กห้องข้าง ๆ ที่ดักรอหลังโรงอาหาร {ผู้ใหญ่}จับแขนถามว่า '{ชื่อ} ไปโดนอะไรมา' คุณยังไม่ได้ตอบอะไร",
  "options": [
   {
    "label": "ไปบอกครูประจำชั้นตรง ๆ",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "bullied"
    ],
    "result": "ครูเรียกเด็กห้องข้าง ๆ ไปคุย กล่องข้าวไม่หายอีกเลย",
    "outcomes": null
   },
   {
    "label": "ขอไปเรียนมวยไทยป้องกันตัว",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.67,
      "result": "เดือนต่อมาไม่มีใครกล้าแตะกล่องข้าวอีกเลย",
      "fx": {
       "knowledge": 0,
       "health": 1,
       "happiness": 2,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "bullied",
       "sporty"
      ]
     },
     {
      "p": 0.33,
      "result": "ต่อยคืนจนโดนเรียกผู้ปกครอง เพื่อนยิ่งเหม็นหน้า",
      "fx": {
       "knowledge": 0,
       "health": -1,
       "happiness": 0,
       "relations": -2,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "bullied"
      ]
     }
    ]
   },
   {
    "label": "ทนเงียบ บอกที่บ้านว่าล้มเอง",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": -1,
     "happiness": -2,
     "relations": -1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "bullied"
    ],
    "result": "ทนเงียบ บอกที่บ้านว่าล้มเอง แต่รอยช้ำยังเพิ่มขึ้นเรื่อย ๆ",
    "outcomes": null
   },
   {
    "label": "ขอที่บ้านย้ายโรงเรียนกลางเทอม",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": -1,
     "network": 0,
     "money": -1
    },
    "setFlags": [
     "bullied"
    ],
    "result": "ย้ายโรงเรียนกลางเทอม เริ่มใหม่แต่ยังไม่มีเพื่อนสักคน",
    "outcomes": null
   },
   {
    "label": "ชวนเพื่อนไปยืนเผชิญหน้าด้วยกัน",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "bullied"
    ],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "ยืนกันเป็นแถว เด็กคนนั้นถอยแล้วไม่กล้าแตะกล่องข้าวอีกเลย",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 2,
       "relations": 1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.5,
      "result": "ทะเลาะกันกลางสนาม พรุ่งนี้โดนแกล้งหนักกว่าเดิม",
      "fx": {
       "knowledge": 0,
       "health": -1,
       "happiness": -2,
       "relations": -2,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   }
  ]
 },
 {
  "id": "N-kid_friend_lunch_01",
  "title": "กล่องข้าวว่างของเพื่อน",
  "ageMin": 10,
  "ageMax": 12,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": null,
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "เพื่อนโต๊ะข้าง ๆ นั่งดื่มน้ำเปล่าตอนพักเที่ยงมาเกือบอาทิตย์ บอกทุกคนว่าไม่หิว แต่ท้องร้องดังจนคนหันมามอง วันนี้มีเด็กกลุ่มหลังห้องเริ่มหัวเราะใส่",
  "options": [
   {
    "label": "แบ่งข้าวกินด้วยกันทุกวัน",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "แบ่งข้าวกินด้วยกันทุกวัน เพื่อนยิ้มออกอีกครั้ง",
    "outcomes": null
   },
   {
    "label": "แอบไปบอกครูประจำชั้น",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ครูประจำชั้นจัดข้าวกลางวันให้เพื่อนอย่างเงียบ ๆ",
    "outcomes": null
   },
   {
    "label": "ทำเป็นไม่เห็น",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ทำเป็นไม่เห็น เพื่อนนั่งดื่มน้ำเปล่าต่อไปอีกหลายวัน",
    "outcomes": null
   },
   {
    "label": "หัวเราะตามกลุ่มหลังห้อง",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": -1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "หัวเราะตามกลุ่มหลังห้อง เพื่อนก้มหน้าไม่พูดกับคุณอีกเลย",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-kid_exam_copy_01",
  "title": "ข้อสอบที่หล่นอยู่",
  "ageMin": 10,
  "ageMax": 12,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {"yearMin": 2552, 
   "sex": null,
   "school": [
    "primary",
    "lower"
   ],
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "หลังเลิกเรียน มีปึกข้อสอบปลายภาควางทิ้งไว้บนโต๊ะครูที่ไม่มีใครอยู่ เพื่อนสองคนกำลังถ่ายรูปเก็บไว้ แล้วหันมาชวนให้ถ่ายด้วย พรุ่งนี้สอบวิชาที่อ่อนที่สุด",
  "options": [
   {
    "label": "ถ่ายรูปเก็บไว้ด้วย",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.67,
      "result": "คะแนนสอบออกมาสูงเกินจนตัวเองยังตกใจ ไม่มีใครถามอะไร",
      "fx": {
       "knowledge": -1,
       "health": 0,
       "happiness": 1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     },
     {
      "p": 0.33,
      "result": "ครูเห็นรูปในโทรศัพท์ของเพื่อน ฝ่ายปกครองเรียกทั้งสามคนเข้าห้อง ชื่อถูกจดลงสมุดประวัติ",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -2,
       "relations": -1,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "school_record"
      ]
     }
    ]
   },
   {
    "label": "เดินออกมา ไปอ่านหนังสือเอง",
    "hint": null,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "เดินกลับบ้านไปอ่านหนังสือเอง สอบผ่านด้วยตัวเอง",
    "outcomes": null
   },
   {
    "label": "ไปบอกครูว่าข้อสอบหลุด",
    "hint": null,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": -1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ครูเปลี่ยนข้อสอบใหม่ทั้งชุด เพื่อนสองคนนั้นไม่พูดด้วยอีก",
    "outcomes": null
   },
   {
    "label": "ยืนดูต้นทางให้เพื่อน",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.67,
      "result": "ไม่มีใครเดินมา เพื่อนให้ขนมเป็นค่าตอบแทน",
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
      "p": 0.33,
      "result": "ภารโรงเดินผ่านมาเห็น ชื่อถูกจดลงสมุดประวัติพร้อมเพื่อน",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": [
       "school_record"
      ]
     }
    ]
   }
  ]
 },
 {
  "id": "N-capsule_bury_01",
  "title": "กล่องใต้ต้นไม้",
  "ageMin": 11,
  "ageMax": 12,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": [
    "primary"
   ],
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "วันสุดท้ายของชั้นประถม ครูประจำชั้นให้ทุกคนเอาของหนึ่งอย่างใส่กล่องสังกะสี แล้วฝังไว้ใต้ต้นไม้หลังอาคารเรียน ครูบอกว่าอีกหลายปีค่อยกลับมาขุดดูว่าตัวเองโตมาเป็นคนแบบไหน",
  "options": [
   {
    "label": "เขียนจดหมายถึงตัวเองตอนโต",
    "hint": null,
    "fx": {
     "knowledge": 1,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "capsule_letter"
    ],
    "result": "เขียนจดหมายถึงตัวเองตอนโต พับใส่กล่อง",
    "outcomes": null
   },
   {
    "label": "ใส่รูปถ่ายกับเพื่อนทั้งห้อง",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "capsule_photo"
    ],
    "result": "ใส่รูปหมู่กับเพื่อนทั้งห้องลงกล่อง",
    "outcomes": null
   },
   {
    "label": "ยอมใส่ของเล่นชิ้นโปรด",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": -1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "capsule_toy"
    ],
    "result": "ตัดใจใส่ของเล่นชิ้นโปรดลงไป",
    "outcomes": null
   },
   {
    "label": "ใส่เหรียญที่หยอดกระปุกมา",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [
     "capsule_coin"
    ],
    "result": "ใส่เหรียญจากกระปุกลงกล่องสังกะสี",
    "outcomes": null
   },
   {
    "label": "ไม่ใส่อะไร ยืนดูเพื่อนฝัง",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ยืนดูเพื่อนฝังกล่อง แล้ววิ่งไปเล่นต่อ",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-child_tree_01",
  "title": "ตกต้นมะม่วง",
  "ageMin": 10,
  "ageMax": 12,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": null,
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "ปีนขึ้นไปเก็บมะม่วงกิ่งบนสุด กิ่งหัก ร่วงลงมาแขนบวมเป่ง เพื่อน ๆ วิ่งไปตามผู้ใหญ่",
  "options": [
   {
    "label": "ยอมให้หมอพื้นบ้านดัดแขน",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.67,
      "result": "น้ำมันสมุนไพรกับเฝือกไม้ไผ่ หายดีในเดือนเดียว",
      "fx": {
       "knowledge": 0,
       "health": 1,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": -1
      },
      "setFlags": []
     },
     {
      "p": 0.33,
      "result": "กระดูกติดเบี้ยวนิด ๆ ยกแขนสุดไม่ได้ แต่ดันโยนลูกเปตองแม่นผิดคน",
      "fx": {
       "knowledge": 0,
       "health": -2,
       "happiness": 1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   },
   {
    "label": "กัดฟันไม่ร้องตอนหมอใส่เฝือก",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": -1
    },
    "setFlags": [],
    "result": "กัดฟันไม่ร้องสักแอะ หมอชมว่าใจเด็ดกว่าผู้ใหญ่",
    "outcomes": null
   },
   {
    "label": "ใส่เฝือกแล้วนั่งอ่านหนังสือแทน",
    "hint": null,
    "fx": {
     "knowledge": 2,
     "health": 1,
     "happiness": -2,
     "relations": 0,
     "network": 0,
     "money": -1
    },
    "setFlags": [],
    "result": "ใส่เฝือกนั่งอ่านหนังสือทั้งเดือน อ่านจบไปหลายเล่ม",
    "outcomes": null
   },
   {
    "label": "ซ่อนแขนบวม บอกที่บ้านว่าไม่เป็นไร",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": -1,
     "happiness": 0,
     "relations": -2,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ซ่อนแขนบวมไว้ ที่บ้านมารู้ทีหลังแล้วเสียใจมาก",
    "outcomes": null
   },
   {
    "label": "ปีนเก่งขนาดนี้ ขอเรียนยิมนาสติก",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.5,
      "result": "โค้ชยิมในเมืองตาลุก ได้ติดทีมเด็ก ถ้วยรางวัลเต็มตู้",
      "fx": {
       "knowledge": 0,
       "health": 1,
       "happiness": 2,
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
      "result": "ซ้อมวันแรกล้มทับแขนข้างเดิม หักซ้ำจุดเดิม",
      "fx": {
       "knowledge": 0,
       "health": -2,
       "happiness": -1,
       "relations": 0,
       "network": 0,
       "money": -1
      },
      "setFlags": []
     }
    ]
   }
  ]
 },
 {
  "id": "N-child_teeth_01",
  "title": "ฟันผุจนแก้มบวม",
  "ageMin": 10,
  "ageMax": 12,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": null,
   "flagsHas": [],
   "flagsNot": [],
   "classes": null
  },
  "text": "ติดน้ำหวานกับลูกอมจนฟันดำเป็นแถบ คืนนี้ปวดฟันร้องไห้ทั้งคืน แก้มบวมข้างเดียวเหมือนอมไข่ไว้",
  "options": [
   {
    "label": "ยอมถอนฟัน แล้วเลิกน้ำหวานเอง",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": -2,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "ยอมถอนฟันแล้วเลิกน้ำหวานเอง เจ็บแต่หายปวด",
    "outcomes": null
   },
   {
    "label": "งอแงขอไปหมอฟันคลินิกเอกชน",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": 1,
     "relations": 1,
     "network": 0,
     "money": -1
    },
    "setFlags": [],
    "result": "หมอฟันคลินิกรักษาให้แทบไม่เจ็บเลย",
    "outcomes": null
   },
   {
    "label": "ไม่ยอมอ้าปากให้ใครดูฟัน",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.33,
      "result": "ฟันน้ำนมหลุดเอง ฟันแท้ขึ้นมาขาวสวยราวปาฏิหาริย์",
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
      "p": 0.67,
      "result": "ฟันซี่ใหม่ผุตามติด ๆ ปวดจนกินข้าวไม่ลงไปหลายเดือน",
      "fx": {
       "knowledge": -1,
       "health": -2,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   },
   {
    "label": "เอาลูกอมไปขายเพื่อน ๆ",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.67,
      "result": "ขายดีจนเสียดายกำไร ไม่กล้ากินเองอีกเลย แต่ข่าวเริ่มไปถึงหูผู้ใหญ่",
      "fx": {
       "knowledge": 1,
       "health": 0,
       "happiness": 0,
       "relations": 0,
       "network": 0,
       "money": 1
      },
      "setFlags": [
       "candy_seller"
      ]
     },
     {
      "p": 0.33,
      "result": "ขายไม่ออก เลยกินเองหมดถุง ฟันผุเพิ่มอีกสองซี่",
      "fx": {
       "knowledge": 0,
       "health": -1,
       "happiness": 1,
       "relations": 0,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   },
   {
    "label": "ยอมให้แม่แปรงฟันให้ทุกคืน",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 1,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "แม่แปรงฟันให้ทุกคืน ฟันกลับมาขาวขึ้น",
    "outcomes": null
   }
  ]
 },
 {
  "id": "N-child_candy_shop_01",
  "title": "ครูเรียกพบเรื่องลูกอม",
  "ageMin": 10,
  "ageMax": 13,
  "kind": "pool",
  "weight": 1,
  "normal": true,
  "cond": {
   "sex": null,
   "school": [
    "primary",
    "lower"
   ],
   "flagsHas": [
    "candy_seller"
   ],
   "flagsNot": [],
   "classes": null
  },
  "text": "แผงลูกอมใต้โต๊ะขายดีจนเพื่อนต่อคิวถึงหน้าห้อง ครูฝ่ายปกครองยืนกอดอกรออยู่ที่ประตู ถามคำเดียวว่าจะเลิกหรือจะดื้อต่อ",
  "options": [
   {
    "label": "ขอครูเปิดบูธในงานโรงเรียน",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.67,
      "result": "ครูหัวเราะแล้วให้ตั้งโต๊ะงานวันเด็ก ขายหมดเกลี้ยงก่อนเที่ยง ได้ฉายาเถ้าแก่น้อย",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 2,
       "relations": 0,
       "network": 1,
       "money": 1
      },
      "setFlags": []
     },
     {
      "p": 0.33,
      "result": "ครูไม่ขำด้วย ยึดลูกอมทั้งกล่อง เรียกผู้ปกครองมาเซ็นรับทราบ",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -1,
       "relations": -1,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   },
   {
    "label": "แอบขายต่อหลังห้องน้ำ",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 0,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": null,
    "outcomes": [
     {
      "p": 0.33,
      "result": "ตลาดมืดหลังห้องน้ำรุ่งเรือง กระปุกออมสินหนักจนยกไม่ขึ้น",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": 1,
       "relations": 0,
       "network": 0,
       "money": 1
      },
      "setFlags": []
     },
     {
      "p": 0.67,
      "result": "โดนรุ่นพี่ดักรีดค่าคุ้มครอง แล้วยังโดนครูจับได้ซ้ำ ทัณฑ์บนติดแฟ้มยันจบ",
      "fx": {
       "knowledge": 0,
       "health": 0,
       "happiness": -2,
       "relations": -2,
       "network": 0,
       "money": 0
      },
      "setFlags": []
     }
    ]
   },
   {
    "label": "เลิกขาย หยอดกำไรใส่กระปุก",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 0,
     "relations": 1,
     "network": 0,
     "money": 1
    },
    "setFlags": [],
    "result": "เลิกขาย หยอดกำไรใส่กระปุก ครูพยักหน้าพอใจ",
    "outcomes": null
   },
   {
    "label": "แจกที่เหลือให้น้องอนุบาล",
    "hint": null,
    "fx": {
     "knowledge": 0,
     "health": 0,
     "happiness": 1,
     "relations": 2,
     "network": 0,
     "money": 0
    },
    "setFlags": [],
    "result": "แจกลูกอมที่เหลือให้น้องอนุบาล น้อง ๆ วิ่งมากอด",
    "outcomes": null
   }
  ]
 }
]);
