import { useEffect, useMemo, useRef, useState } from 'react'

type CoffeeLine = {
  name: string
  singlePrice: number
  doublePrice: number
}

type Product = {
  id: string
  name: string
  en: string
  category: string
  desc: string
  ingredients: string
  image: string
  prep: string
  price?: number
  coffeeLines?: CoffeeLine[]
  pairing?: string
}

const categories = [
  { id: 'hot-coffee', label: 'قهوه داغ' },
  { id: 'cold-coffee', label: 'قهوه سرد' },
  { id: 'coldbrew', label: 'کلدبرو' },
  { id: 'coco', label: 'کوکو' },
  { id: 'lemonade', label: 'لیموناد' },
  { id: 'ice-tea', label: 'آیس‌تی' },
  { id: 'tea', label: 'چای و دمنوش' },
  { id: 'smoothie', label: 'اسموتی' },
  { id: 'milkshake', label: 'میلک‌شیک' },
  { id: 'breakfast', label: 'صبحانه' },
  { id: 'burger', label: 'برگر و هات‌داگ' },
  { id: 'pasta', label: 'پاستا' },
  { id: 'chapata', label: 'چاپاتا' },
] as const

const priceFormatter = new Intl.NumberFormat('fa-IR')
const formatPrice = (value: number) => `${priceFormatter.format(value)} تومان`
const displayPrice = (product: Product) => (product.coffeeLines ? 'انتخاب لاین قهوه' : formatPrice(product.price || 0))

const makeCoffeeLines = (base: number): CoffeeLine[] => [
  { name: '۲۰/۸۰', singlePrice: base, doublePrice: base + 100000 },
  { name: '۳۰/۷۰', singlePrice: base + 10000, doublePrice: base + 110000 },
  { name: '۵۰/۵۰', singlePrice: base + 20000, doublePrice: base + 120000 },
  { name: '۶۰/۴۰', singlePrice: base + 30000, doublePrice: base + 130000 },
  { name: '۱۰۰ ربوستا', singlePrice: base + 15000, doublePrice: base + 115000 },
  { name: '۱۰۰ عربیکا', singlePrice: base + 50000, doublePrice: base + 150000 },
]

const syrups = [
  'کارامل',
  'شکلات',
  'ایریش',
  'فندق',
  'وانیل',
  'پامپکین اسپایس',
  'بلوبری',
  'کوکی',
  'بادام زمینی',
  'زعفران',
  'دارچین',
  'نارگیل',
]

const syrupPrice = 70000
const syrupEligibleProductIds = new Set([
  'hc3', 'hc5', 'hc6',
  'cc3', 'cc6',
  'co1', 'co2',
  'le1', 'le2',
  'it1', 'it2',
  'sm1', 'sm2', 'sm3',
  'ms1', 'ms2', 'ms3',
])
const canAddSyrup = (product: Product) => syrupEligibleProductIds.has(product.id)

function ZoneLogo({ size = 40, rounded = 12 }: { size?: number; rounded?: number }) {
  return (
    <span
      className="block shrink-0 overflow-hidden"
      style={{ width: size, height: size, borderRadius: rounded, backgroundColor: '#ec2039' }}
    >
      <img
        src="/assets/zone-logo.png"
        alt="Zone Cafe"
        width={size}
        height={size}
        className="block h-full w-full object-cover"
      />
    </span>
  )
}

const products: Product[] = [
  { id: 'hc1', name: 'اسپرسو', en: 'Espresso', category: 'hot-coffee', desc: 'عصاره‌ی خالص قهوه با کرمای نرم و عطر برشته', ingredients: 'شات اسپرسو', image: '/assets/products/espresso.jpg', prep: '۳ دقیقه', coffeeLines: makeCoffeeLines(220000), pairing: 'بهترین همراه براونی شکلاتی' },
  { id: 'hc2', name: 'آمریکانو', en: 'Americano', category: 'hot-coffee', desc: 'طعم شفاف و سبک با بادی متعادل', ingredients: 'اسپرسو، آب داغ', image: '/assets/products/americano.jpg', prep: '۳ دقیقه', coffeeLines: makeCoffeeLines(240000), pairing: 'با کوکی کره‌ای عالی است' },
  { id: 'hc3', name: 'لاته', en: 'Latte', category: 'hot-coffee', desc: 'شیر بخار داده‌شده با بافت ابریشمی و طعم متعادل', ingredients: 'اسپرسو، شیر تازه', image: '/assets/products/latte.jpg', prep: '۴ دقیقه', coffeeLines: makeCoffeeLines(270000), pairing: 'همراه چیزکیک وانیلی' },
  { id: 'hc4', name: 'کورتادو', en: 'Cortado', category: 'hot-coffee', desc: 'تعادل دقیق اسپرسو و شیر برای طعم خالص‌تر قهوه', ingredients: 'اسپرسو، شیر', image: '/assets/products/cortado.jpg', prep: '۳ دقیقه', coffeeLines: makeCoffeeLines(270000), pairing: 'کنار کروسان ساده' },
  { id: 'hc5', name: 'کاپوچینو', en: 'Cappuccino', category: 'hot-coffee', desc: 'کلاسیک ایتالیایی با فوم شیر و پایان لطیف', ingredients: 'اسپرسو، فوم شیر، پودر کاکائو', image: '/assets/products/cappuccino.jpg', prep: '۴ دقیقه', coffeeLines: makeCoffeeLines(270000), pairing: 'با کوکی شکلاتی' },
  { id: 'hc6', name: 'موکا', en: 'Mocha', category: 'hot-coffee', desc: 'ترکیب اسپرسو، شیر و شکلات تلخ با بافت مخملی', ingredients: 'اسپرسو، شیر، سس شکلات', image: '/assets/products/mocha.jpg', prep: '۵ دقیقه', coffeeLines: makeCoffeeLines(330000), pairing: 'همراه کیک شکلاتی روز' },

  { id: 'cc1', name: 'آیس اسپرسو', en: 'Iced Espresso', category: 'cold-coffee', desc: 'خالص، خنک و سریع برای شروع روز', ingredients: 'اسپرسو، یخ', image: '/assets/products/iced-espresso.jpg', prep: '۲ دقیقه', coffeeLines: makeCoffeeLines(220000), pairing: 'با براونی گردو' },
  { id: 'cc2', name: 'آیس آمریکانو', en: 'Iced Americano', category: 'cold-coffee', desc: 'شفاف، سبک و خنک با پایان تمیز', ingredients: 'اسپرسو، آب، یخ', image: '/assets/products/iced-americano.jpg', prep: '۳ دقیقه', coffeeLines: makeCoffeeLines(240000), pairing: 'در کنار کوکی بادام' },
  { id: 'cc3', name: 'آیس لاته', en: 'Iced Latte', category: 'cold-coffee', desc: 'خنک، شیری و مناسب برای نوشیدن طولانی', ingredients: 'اسپرسو، شیر سرد، یخ', image: '/assets/products/iced-latte.jpg', prep: '۳ دقیقه', coffeeLines: makeCoffeeLines(280000), pairing: 'همراه چیزکیک' },
  { id: 'cc4', name: 'آیس آمریکانو سودا لیمو', en: 'Americano Soda Lemon', category: 'cold-coffee', desc: 'ترکیب گازدار و مرکباتی با پایان بسیار تازه', ingredients: 'اسپرسو، سودا، لیمو تازه', image: '/assets/products/americano-soda-lemon.jpg', prep: '۴ دقیقه', coffeeLines: makeCoffeeLines(290000), pairing: 'همراه تارت لیمو' },
  { id: 'cc5', name: 'آفوگاتو', en: 'Affogato', category: 'cold-coffee', desc: 'بستنی وانیلی با شات اسپرسو، کوتاه و دلچسب', ingredients: 'بستنی وانیلی، اسپرسو', image: '/assets/products/affogato.jpg', prep: '۲ دقیقه', price: 300000, pairing: 'کنار بیسکویت کاراملی' },
  { id: 'cc6', name: 'فراپاچینو', en: 'Frappuccino', category: 'cold-coffee', desc: 'نوشیدنی یخی خامه‌ای با بافت نرم و خنک', ingredients: 'اسپرسو، شیر، یخ، خامه', image: '/assets/products/frappuccino.jpg', prep: '۵ دقیقه', price: 300000, pairing: 'همراه چیزکیک نیویورکی' },

  { id: 'cb1', name: 'کلدبرو کلاسیک', en: 'Cold Brew Classic', category: 'coldbrew', desc: 'دم‌آوری طولانی با طعم نرم، تمیز و عمیق', ingredients: 'قهوه کلدبرو', image: '/assets/products/iced-espresso.jpg', prep: '۱ دقیقه', coffeeLines: makeCoffeeLines(250000), pairing: 'با براونی تلخ' },
  { id: 'cb2', name: 'کلدبرو پرتقال', en: 'Cold Brew Orange', category: 'coldbrew', desc: 'کلدبرو با مرکبات تازه و حس خنک تابستانی', ingredients: 'کلدبرو، آب پرتقال، سودا', image: '/assets/products/cold-brew-orange.jpg', prep: '۳ دقیقه', coffeeLines: makeCoffeeLines(290000), pairing: 'همراه تارت پرتقال' },
  { id: 'cb3', name: 'کلدبرو انبه', en: 'Cold Brew Mango', category: 'coldbrew', desc: 'کلدبرو میوه‌ای با طعم انبه و پایان خنک', ingredients: 'کلدبرو، پوره انبه، سیروپ انبه', image: '/assets/products/cold-brew-mango.jpg', prep: '۴ دقیقه', coffeeLines: makeCoffeeLines(290000), pairing: 'با کیک وانیلی سبک' },

  { id: 'co1', name: 'کوکو نوتلا', en: 'Coco Nutella', category: 'coco', desc: 'شیر و نوتلا با بافت گرم و خامه‌ای', ingredients: 'شیر، نوتلا، پودر کاکائو', image: '/assets/products/coco-nutella.jpg', prep: '۴ دقیقه', price: 290000, pairing: 'همراه وافل ساده' },
  { id: 'co2', name: 'کوکو لوتوس', en: 'Coco Lotus', category: 'coco', desc: 'ترکیب گرم و کاراملی با عطر بیسکویت لوتوس', ingredients: 'شیر، کره لوتوس، خامه', image: '/assets/products/mocha.jpg', prep: '۴ دقیقه', price: 290000, pairing: 'کنار کیک دارچینی' },

  { id: 'le1', name: 'لیموناد کلاسیک', en: 'Classic Lemonade', category: 'lemonade', desc: 'ترش و شیرین با لیموی تازه و خنکی بالا', ingredients: 'لیمو، سیروپ لیمو', image: '/assets/products/classic-lemonade.webp', prep: '۲ دقیقه', price: 200000, pairing: 'همراه سالاد سبک' },
  { id: 'le2', name: 'لیموناد بلو', en: 'Blue Lemonade', category: 'lemonade', desc: 'رنگی، خنک و خوش‌عطر با ته‌مزه مرکبات', ingredients: 'بلوکاراسائو، لیمو', image: '/assets/products/blue-lemonade.jpg', prep: '۲ دقیقه', price: 200000, pairing: 'همراه دسر میوه‌ای' },

  { id: 'it1', name: 'آیس‌تی کلاسیک', en: 'Classic Ice Tea', category: 'ice-tea', desc: 'چای سرد خوش‌عطر با طعمی تمیز و ساده', ingredients: 'چای، لیمو', image: '/assets/products/classic-ice-tea.jpg', prep: '۲ دقیقه', price: 250000, pairing: 'با ساندویچ سبک' },
  { id: 'it2', name: 'آیس‌تی تروپیکال', en: 'Tropical Ice Tea', category: 'ice-tea', desc: 'چای سرد با انبه و آناناس و حس استوایی', ingredients: 'چای، انبه، آناناس', image: '/assets/products/tropical-ice-tea.jpg', prep: '۳ دقیقه', price: 250000, pairing: 'همراه دسر میوه‌ای' },

  { id: 't1', name: 'چای', en: 'Tea', category: 'tea', desc: 'چای ساده و خوش‌دم برای هر ساعت روز', ingredients: 'چای ایرانی', image: '/assets/products/tea.jpg', prep: '۵ دقیقه', price: 100000, pairing: 'همراه خرما یا شیرینی روز' },
  { id: 't2', name: 'چای سبز', en: 'Green Tea', category: 'tea', desc: 'سبک، آرام و مناسب بعد از غذا', ingredients: 'چای سبز', image: '/assets/products/green-tea.webp', prep: '۵ دقیقه', price: 200000, pairing: 'همراه کیک سبک' },
  { id: 't3', name: 'دمنوش شیراز', en: 'Shiraz Herbal', category: 'tea', desc: 'ترکیب بهارنارنج و گل محمدی با رایحه آرامش‌بخش', ingredients: 'بهارنارنج، گل محمدی', image: '/assets/products/shiraz-herbal.jpg', prep: '۵ دقیقه', price: 200000, pairing: 'با کوکی بادام' },

  { id: 'sm1', name: 'اسموتی آمازون', en: 'Amazon Smoothie', category: 'smoothie', desc: 'آناناس، بلوبری، لیمو و بافت خنک و پرانرژی', ingredients: 'آناناس، بلوبری، لیمو', image: '/assets/products/amazon-smoothie.jpg', prep: '۵ دقیقه', price: 350000, pairing: 'همراه سالاد سزار' },
  { id: 'sm2', name: 'اسموتی ماداگاسکار', en: 'Madagascar', category: 'smoothie', desc: 'میوه‌ای و نرم با طعم سیب و آناناس', ingredients: 'آب سیب، آناناس، خامه', image: '/assets/products/madagascar.jpg', prep: '۵ دقیقه', price: 350000, pairing: 'همراه کیک لیمو' },
  { id: 'sm3', name: 'اسموتی رد سو', en: 'Red Soul', category: 'smoothie', desc: 'ترکیب بری و انار با رنگ عمیق و طعم تازه', ingredients: 'انار، بری، لیمو', image: '/assets/products/red-soul.jpg', prep: '۵ دقیقه', price: 350000, pairing: 'با چیزکیک توت' },

  { id: 'ms1', name: 'میلک‌شیک لوتوس', en: 'Lotus Milkshake', category: 'milkshake', desc: 'خامه‌ای، غلیظ و کاراملی با طعم لوتوس', ingredients: 'بستنی، لوتوس، شیر', image: '/assets/products/lotus-milkshake.jpg', prep: '۵ دقیقه', price: 390000, pairing: 'همراه کوکی شکلاتی' },
  { id: 'ms2', name: 'میلک‌شیک زون', en: 'Zone Special', category: 'milkshake', desc: 'ترکیب ویژه زون با شکلات، اورئو و لوتوس', ingredients: 'بستنی، شکلات، اورئو، لوتوس', image: '/assets/products/zone-special.jpg', prep: '۶ دقیقه', price: 550000, pairing: 'برای اشتراک دو نفره عالی است' },
  { id: 'ms3', name: 'میلک‌شیک اورئو', en: 'Oreo Milkshake', category: 'milkshake', desc: 'کلاسیک محبوب با بافت غلیظ و تکه‌های اورئو', ingredients: 'شیر، بستنی، اورئو', image: '/assets/products/oreo-milkshake.jpg', prep: '۴ دقیقه', price: 390000, pairing: 'همراه براونی' },

  { id: 'bf1', name: 'تابه زون انگلیسی', en: 'Zone English Pan', category: 'breakfast', desc: 'صبحانه کامل و سیرکننده برای شروع روز', ingredients: 'سوسیس، بیکن، تخم‌مرغ، قارچ', image: '/assets/products/zone-english-pan.jpg', prep: '۱۵ دقیقه', price: 750000, pairing: 'همراه آمریکانو' },
  { id: 'bf2', name: 'تابه گوجه', en: 'Tomato Pan', category: 'breakfast', desc: 'تخم‌مرغ در سس گوجه‌ی دست‌ساز و تازه', ingredients: 'تخم‌مرغ، گوجه، سس مخصوص', image: '/assets/products/tomato-pan.jpg', prep: '۱۰ دقیقه', price: 300000, pairing: 'همراه چای داغ' },
  { id: 'bf3', name: 'اسکرامبل بیکن', en: 'Bacon Scramble', category: 'breakfast', desc: 'تخم‌مرغ همزده خامه‌ای با بیکن گوساله', ingredients: 'تخم‌مرغ، خامه، بیکن', image: '/assets/products/bacon-scramble.jpg', prep: '۱۲ دقیقه', price: 550000, pairing: 'همراه اسپرسو' },

  { id: 'bg1', name: 'برگر زون', en: 'Zone Burger', category: 'burger', desc: 'برگر ۱۵۰ گرمی با سس مخصوص و نان تازه', ingredients: 'گوشت، پنیر، کاهو، سس مخصوص', image: '/assets/products/zone-burger.jpg', prep: '۱۴ دقیقه', price: 650000, pairing: 'همراه لیموناد کلاسیک' },
  { id: 'bg2', name: 'هات‌داگ آمریکایی', en: 'American Hot Dog', category: 'burger', desc: 'هات‌داگ خوش‌طعم با سس ویژه و نان تازه', ingredients: 'هات‌داگ، نان، سس خردل', image: '/assets/products/american-hot-dog.jpg', prep: '۱۰ دقیقه', price: 550000, pairing: 'همراه آیس‌تی کلاسیک' },

  { id: 'pa1', name: 'پاستا آلفردو', en: 'Alfredo Pasta', category: 'pasta', desc: 'پنه با مرغ گریل و سس آلفردوی خامه‌ای', ingredients: 'پنه، مرغ، سس آلفردو', image: '/assets/products/alfredo-pasta.jpg', prep: '۱۵ دقیقه', price: 600000, pairing: 'همراه آیس‌تی تروپیکال' },
  { id: 'pa2', name: 'پاستا گوجه', en: 'Tomato Pasta', category: 'pasta', desc: 'پنه با سس گوجه و گوشت چرخ‌کرده', ingredients: 'پنه، گوشت، سس گوجه', image: '/assets/products/tomato-pasta.jpg', prep: '۱۳ دقیقه', price: 650000, pairing: 'همراه لیموناد بلو' },

  { id: 'ch1', name: 'چاپاتا بیکن کاراملایز', en: 'Bacon Caramel Chapata', category: 'chapata', desc: 'چاپاتای گرم با بیکن، کاهو و سس کاراملی', ingredients: 'نان چاپاتا، بیکن، کاهو، سس کارامل', image: '/assets/products/bacon-caramel-chapata.jpg', prep: '۱۲ دقیقه', price: 700000, pairing: 'همراه آیس آمریکانو' },
  { id: 'ch2', name: 'چاپاتا بوفالو', en: 'Buffalo Chapata', category: 'chapata', desc: 'گوشت، چدار و سس بوفالو با طعم جسورانه', ingredients: 'گوشت، پنیر چدار، سس بوفالو', image: '/assets/products/buffalo-chapata.jpg', prep: '۱۴ دقیقه', price: 750000, pairing: 'همراه لیموناد کلاسیک' },
  { id: 'ch3', name: 'چاپاتا زینگر', en: 'Zinger Chapata', category: 'chapata', desc: 'مرغ سوخاری ترد با سس سیر و کاهوی تازه', ingredients: 'مرغ سوخاری، سس سیر، کاهو', image: '/assets/products/tomato-pan.jpg', prep: '۱۳ دقیقه', price: 650000, pairing: 'همراه آیس‌تی کلاسیک' },
]

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('zone-dark')
    return saved === null ? true : saved === '1'
  })
  const [query, setQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>(categories[0].id)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showSearch, setShowSearch] = useState(false)
  const [sheetDragY, setSheetDragY] = useState(0)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const pillsRef = useRef<HTMLDivElement | null>(null)
  const sheetDragStartY = useRef<number | null>(null)
  const sheetDragCurrentY = useRef(0)

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1050)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    localStorage.setItem('zone-dark', dark ? '1' : '0')
  }, [dark])

  useEffect(() => {
    const onScroll = () => {
      if (searchQuery.trim()) return

      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24
      if (nearBottom) {
        setActiveCategory(categories[categories.length - 1].id)
        return
      }

      let current: string = categories[0].id
      for (const category of categories) {
        const el = sectionRefs.current[category.id]
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= 150) current = category.id
      }
      setActiveCategory(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [searchQuery])

  useEffect(() => {
    const activeIndex = categories.findIndex((item) => item.id === activeCategory)
    const container = pillsRef.current
    if (!container || activeIndex < 0) return
    const activeButton = container.querySelector<HTMLButtonElement>(`[data-cat='${activeCategory}']`)
    activeButton?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [activeCategory])

  const groupedProducts = useMemo(
    () => categories.map((category) => ({ ...category, items: products.filter((product) => product.category === category.id) })),
    [],
  )

  const filterProducts = (value: string) => {
    const normalized = value
      .trim()
      .toLowerCase()
      .replace(/ي/g, 'ی')
      .replace(/ك/g, 'ک')
    if (!normalized) return []

    return products.filter((product) => {
      const categoryLabel = categories.find((item) => item.id === product.category)?.label || ''
      const lineText = product.coffeeLines?.map((line) => line.name).join(' ') || ''
      const searchableText = [
        product.name,
        product.en,
        product.desc,
        product.ingredients,
        categoryLabel,
        lineText,
      ]
        .join(' ')
        .toLowerCase()
        .replace(/ي/g, 'ی')
        .replace(/ك/g, 'ک')

      return searchableText.includes(normalized)
    })
  }

  const searchResults = useMemo(() => filterProducts(searchQuery), [searchQuery])
  const liveSearchResults = useMemo(() => filterProducts(query), [query])
  const suggestions = useMemo(() => liveSearchResults.slice(0, 5), [liveSearchResults])

  const scrollToCategory = (categoryId: string) => {
    setQuery('')
    setSearchQuery('')
    setShowSearch(false)
    setActiveCategory(categoryId)
    const target = sectionRefs.current[categoryId]
    if (!target) return
    const y = target.getBoundingClientRect().top + window.scrollY - 126
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  const submitSearch = () => {
    const value = query.trim()
    if (!value) {
      setSearchQuery('')
      setShowSearch(false)
      return
    }
    setSearchQuery(value)
    setShowSearch(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goHome = () => {
    setQuery('')
    setSearchQuery('')
    setShowSearch(false)
    setSelectedProduct(null)
    setActiveCategory(categories[0].id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const categoryLabel = (categoryId: string) => categories.find((item) => item.id === categoryId)?.label || ''

  return (
    <div dir="rtl" style={{ fontFamily: 'Vazirmatn, system-ui, sans-serif' }} className={`${dark ? 'bg-[#0a0a0a] text-white' : 'bg-white text-zinc-900'} min-h-screen antialiased selection:bg-[#e30613]/20`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
        *{font-family:'Vazirmatn' !important}
        ::-webkit-scrollbar{width:0;height:0}
        .hide-scroll::-webkit-scrollbar{display:none}
        .hide-scroll{ -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>

      {isLoading && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center ${dark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
          <div className="flex flex-col items-center gap-5 animate-[fadeIn_0.6s_ease]">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#e30613]/20 blur-3xl" style={{ transform: 'scale(1.45)' }} />
              <div className="relative shadow-[0_20px_60px_rgba(247,25,63,0.35)] animate-[scaleIn_1s_cubic-bezier(0.16,1,0.3,1)]">
                <ZoneLogo size={110} rounded={20} />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-[22px] font-[800] tracking-[0.14em]">ZONE CAFE</h1>
              <p className={`mt-2 text-[12px] tracking-[0.2em] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>DIGITAL MENU</p>
            </div>
          </div>
          <style>{`
            @keyframes scaleIn { 0%{transform:scale(.9);opacity:0} 60%{transform:scale(1.04);opacity:1} 100%{transform:scale(1)} }
            @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
          `}</style>
        </div>
      )}

      <header className="sticky top-0 z-40">
        <div className={`${dark ? 'bg-[#0a0a0a]/78 border-zinc-800' : 'bg-white/85 border-zinc-100'} border-b backdrop-blur-[18px]`}>
          <div className="page-container mx-auto max-w-[1120px]">
            <div className="flex h-[64px] items-center justify-between gap-4">
              <button
                type="button"
                onClick={goHome}
                aria-label="بازگشت به صفحه اصلی زون کافه"
                className="group flex items-center gap-3 rounded-2xl text-right transition active:scale-[0.98]"
              >
                <ZoneLogo size={40} rounded={12} />
                <div>
                  <div className="text-[16px] font-[800] tracking-[0.08em] transition group-hover:text-[#e30613]">ZONE CAFE</div>
                  <div className={`text-[11px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>منوی دیجیتال</div>
                </div>
              </button>

              <div className="flex items-center gap-2">
                <button onClick={() => setShowSearch(true)} aria-label="جستجو" className={`grid h-10 w-10 place-items-center rounded-full border transition active:scale-95 ${dark ? 'border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="M20 20L16.5 16.5" /></svg>
                </button>
                <button onClick={() => setDark(!dark)} aria-label="تغییر تم" className={`grid h-10 w-10 place-items-center rounded-full border transition active:scale-95 ${dark ? 'border-zinc-800 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-700'}`}>
                  {dark ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`${dark ? 'bg-[#0a0a0a]/72 border-zinc-800' : 'bg-white/80 border-zinc-100'} border-b backdrop-blur-[14px]`}>
          <div className="page-container mx-auto max-w-[1120px]">
            <div ref={pillsRef} className="hide-scroll flex gap-2 overflow-x-auto py-3 scroll-smooth">
              {categories.map((category) => {
                const active = activeCategory === category.id && !query.trim()
                return (
                  <button
                    key={category.id}
                    data-cat={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-[500] transition-all active:scale-[0.98] ${active ? 'border-[#e30613] bg-[#e30613] text-white shadow-[0_8px_20px_rgba(227,6,19,0.25)]' : dark ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'}`}
                  >
                    {category.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      {showSearch && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div onClick={() => setShowSearch(false)} className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className={`${dark ? 'bg-[#141414] border-zinc-800' : 'bg-white border-zinc-100'} relative mx-auto mt-[8vh] w-[94%] max-w-[640px] overflow-hidden rounded-[24px] border shadow-[0_20px_80px_rgba(0,0,0,0.2)]`}>
            <div className={`flex items-center gap-3 border-b px-4 py-3 ${dark ? 'border-zinc-800' : 'border-zinc-100'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-zinc-400"><circle cx="11" cy="11" r="7" /><path d="M20 20L16.5 16.5" /></svg>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitSearch()
                }}
                placeholder="جستجوی نوشیدنی، غذا یا مواد اولیه..."
                className={`flex-1 bg-transparent text-[15px] outline-none placeholder:text-zinc-400 ${dark ? 'text-white' : 'text-zinc-900'}`}
              />
              <button onClick={() => setShowSearch(false)} className={`rounded-full px-3 py-1.5 text-sm ${dark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>بستن</button>
            </div>

            <div className="max-h-[56vh] overflow-auto p-3">
              {!query ? (
                <div className="p-6 text-center">
                  <div className={`mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full ${dark ? 'bg-zinc-900' : 'bg-zinc-50'}`}>☕️</div>
                  <p className={`text-sm ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>مثلاً بنویسید: لاته، لیمو، اورئو، پاستا</p>
                </div>
              ) : suggestions.length ? (
                <div className="space-y-2">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedProduct(item)
                        setShowSearch(false)
                      }}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-2.5 text-right transition ${dark ? 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800' : 'border-zinc-100 bg-white hover:bg-zinc-50'}`}
                    >
                      <img src={item.image} alt={item.name} loading="lazy" className="h-12 w-12 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-[700] truncate">{item.name}</div>
                        <div className={`mt-1 text-[11px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{categoryLabel(item.category)}</div>
                      </div>
                      <span className={`shrink-0 text-[11px] font-[700] ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>{displayPrice(item)}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={`p-8 text-center text-sm ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>موردی برای «{query}» پیدا نشد.</div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="page-container mx-auto max-w-[1120px] pb-12">
        <div className="flex items-center justify-between gap-3 pb-2 pt-5">
          <div>
            <h2 className="text-[18px] font-[700] sm:text-[20px]">{searchQuery.trim() ? searchQuery.trim() : 'منوی زون'}</h2>
            <p className={`mt-1 text-[12px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{searchQuery.trim() ? 'نتایج جستجو' : 'اسکرول کنید و هر آیتم را برای دیدن جزئیات لمس کنید'}</p>
          </div>
          <div className={`shrink-0 text-[12px] font-[500] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {searchQuery.trim() ? `${searchResults.length} نتیجه` : `${products.length} آیتم`}
          </div>
        </div>

        {searchQuery.trim() ? (
          <section className="mt-3 space-y-2.5">
            {searchResults.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`w-full rounded-[20px] border p-2.5 text-right transition active:scale-[0.99] ${dark ? 'border-zinc-800 bg-[#141414]' : 'border-zinc-100 bg-white'} shadow-[0_4px_16px_rgba(0,0,0,0.04)]`}
              >
                <div className="flex items-center gap-3">
                  <img src={product.image} alt={product.name} loading="lazy" className="h-[72px] w-[72px] rounded-[16px] object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-[13px] font-[700] sm:text-[13.5px]">{product.name}</h4>
                        <p className={`mt-1 text-[11px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{categoryLabel(product.category)}</p>
                        <p className={`mt-1 text-[10.5px] line-clamp-1 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>{product.ingredients}</p>
                      </div>
                      <div className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-[800] ${dark ? 'border border-zinc-800 bg-zinc-900 text-white' : 'bg-zinc-900 text-white'}`}>
                        {displayPrice(product)}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`rounded-full px-2 py-1 text-[10px] ${dark ? 'border border-zinc-800 bg-zinc-900 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>{product.prep}</span>
                      <span className="text-[11px] font-[700] text-[#e30613]">جزئیات</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {!searchResults.length && (
              <div className={`mt-8 rounded-[24px] border-2 border-dashed p-10 text-center ${dark ? 'border-zinc-800 bg-zinc-900/30' : 'border-zinc-200 bg-zinc-50'}`}>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e30613]/10 text-xl">🔍</div>
                <p className="mt-4 font-[700]">چیزی پیدا نشد</p>
                <p className={`mt-1 text-sm ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>عبارت جستجو را تغییر دهید یا نام دسته را جستجو کنید.</p>
                <button onClick={() => { setQuery(''); setSearchQuery('') }} className="mt-4 rounded-full bg-[#e30613] px-5 py-2.5 text-sm font-semibold text-white">پاک کردن جستجو</button>
              </div>
            )}
          </section>
        ) : (
          <div className="mt-4 space-y-7">
            {groupedProducts.map((section) => (
              <section key={section.id} ref={(el) => { sectionRefs.current[section.id] = el }} className="scroll-mt-[132px]">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-[15px] font-[700]">
                    <span className="h-5 w-1 rounded-full bg-[#e30613]" />
                    {section.label}
                  </h3>
                  <span className={`text-[11px] ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>{section.items.length} آیتم</span>
                </div>

                <div className="space-y-2.5">
                  {section.items.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`group w-full rounded-[20px] border p-2.5 text-right transition active:scale-[0.99] ${dark ? 'border-zinc-800 bg-[#141414] hover:border-zinc-700' : 'border-zinc-100 bg-white hover:border-zinc-200'} shadow-[0_4px_16px_rgba(0,0,0,0.04)]`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-[72px] w-[72px] overflow-hidden rounded-[16px] shrink-0 sm:h-[80px] sm:w-[80px]">
                          <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h4 className="truncate text-[13px] font-[700] leading-5 sm:text-[13.5px]">{product.name}</h4>
                              <p className={`mt-1 line-clamp-1 text-[11px] leading-4 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{product.desc}</p>
                              <p className={`mt-1 line-clamp-1 text-[10.5px] ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>{product.ingredients}</p>
                            </div>
                            <div className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-[800] ${dark ? 'border border-zinc-800 bg-zinc-900 text-white' : 'bg-zinc-900 text-white'}`}>
                              {displayPrice(product)}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span className={`rounded-full px-2 py-1 text-[10px] ${dark ? 'border border-zinc-800 bg-zinc-900 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>{product.prep}</span>
                            <span className="text-[11px] font-[700] text-[#e30613]">جزئیات</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <section className={`mt-8 rounded-[22px] border p-4 sm:p-5 ${dark ? 'border-zinc-800 bg-[#141414]' : 'border-zinc-100 bg-zinc-50'}`}>
          <div className="grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <h4 className="text-[13px] font-[700]">⏰ ساعات کاری</h4>
              <p className={`mt-1.5 leading-6 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>شنبه تا جمعه ۸:۰۰ تا ۲۴:۰۰</p>
            </div>
            <div>
              <h4 className="text-[13px] font-[700]">📍 شیراز</h4>
              <p className={`mt-1.5 leading-6 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>بلوار چمران، نبش کوچه ۱۰</p>
            </div>
            <div>
              <h4 className="text-[13px] font-[700]">📱 اینستاگرام</h4>
              <p className={`mt-1.5 leading-6 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>ZONECAFE.SHIRAZ</p>
            </div>
          </div>
        </section>

        <footer className="pb-2 pt-5 text-center">
          <a
            href="https://www.instagram.com/behrad_badiee/"
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-1.5 text-[11px] transition hover:text-[#e30613] ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}
          >
            طراحی شده توسط <span className="font-[700] text-[#e30613]">@behrad_badiee</span>
          </a>
        </footer>
      </main>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div onClick={() => { setSheetDragY(0); sheetDragCurrentY.current = 0; setSelectedProduct(null) }} className="absolute inset-0 bg-black/45 backdrop-blur-[3px]" />
          <div
            className={`relative max-h-[88vh] w-full max-w-[560px] overflow-auto rounded-t-[28px] border-t shadow-[0_-20px_60px_rgba(0,0,0,0.25)] ${dark ? 'border-zinc-800 bg-[#111]' : 'border-zinc-100 bg-white'} animate-[sheetIn_0.32s_cubic-bezier(0.16,1,0.3,1)]`}
            style={{ transform: `translateY(${sheetDragY}px)`, transition: sheetDragY === 0 ? 'transform 180ms ease' : 'none' }}
          >
            <div className="sticky top-0 z-10 flex justify-center bg-inherit pb-2 pt-3 backdrop-blur-xl">
              <div
                className={`h-1.5 w-10 cursor-grab touch-none rounded-full ${dark ? 'bg-zinc-700' : 'bg-zinc-200'} ${sheetDragY > 0 ? 'cursor-grabbing' : ''}`}
                onPointerDown={(event) => {
                  sheetDragStartY.current = event.clientY
                  event.currentTarget.setPointerCapture(event.pointerId)
                }}
                onPointerMove={(event) => {
                  if (!event.currentTarget.hasPointerCapture(event.pointerId) || sheetDragStartY.current === null) return
                  const nextY = Math.max(0, event.clientY - sheetDragStartY.current)
                  sheetDragCurrentY.current = nextY
                  setSheetDragY(nextY)
                }}
                onPointerUp={(event) => {
                  if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
                  event.currentTarget.releasePointerCapture(event.pointerId)
                  if (sheetDragCurrentY.current > 80) {
                    setSheetDragY(0)
                    setSelectedProduct(null)
                  } else {
                    setSheetDragY(0)
                  }
                  sheetDragCurrentY.current = 0
                  sheetDragStartY.current = null
                }}
                onPointerCancel={() => { setSheetDragY(0); sheetDragCurrentY.current = 0; sheetDragStartY.current = null }}
              />
            </div>

            <div className="page-container pb-6">
              <div className="relative overflow-hidden rounded-[22px]">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="h-[280px] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
                <button onClick={() => { setSheetDragY(0); sheetDragCurrentY.current = 0; setSelectedProduct(null) }} className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                  <div>
                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-zinc-800 backdrop-blur">{categoryLabel(selectedProduct.category)}</span>
                    <h3 className="mt-2 text-[22px] font-[800] leading-none text-white drop-shadow">{selectedProduct.name}</h3>
                    <p className="mt-1 text-xs text-white/80">{selectedProduct.en} — {selectedProduct.ingredients}</p>
                  </div>
                  <div className={`shrink-0 rounded-2xl border px-4 py-3 text-center backdrop-blur-xl ${dark ? 'border-white/10 bg-zinc-900/80 text-white' : 'border-white bg-white/95 text-zinc-900'}`}>
                    <div className="text-[11px] opacity-60">قیمت</div>
                    <div className="mt-1 text-[14px] font-[800] leading-5">{displayPrice(selectedProduct)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <h4 className={`text-[13px] font-[700] ${dark ? 'text-zinc-200' : 'text-zinc-800'}`}>توضیحات</h4>
                  <p className={`mt-1.5 text-[13.5px] leading-6 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>{selectedProduct.desc} — با مواد اولیه تازه و کیفیت ثابت زون تهیه می‌شود.</p>
                </div>

                {selectedProduct.coffeeLines ? (
                  <div className={`rounded-2xl border p-3.5 ${dark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-100 bg-zinc-50'}`}>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-[700]">لاین قهوه و تعداد شات</div>
                        <p className={`mt-1 text-[11px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>برای هر لاین، قیمت سینگل و دبل جداگانه محاسبه شده است.</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {selectedProduct.coffeeLines.map((line) => (
                        <div key={line.name} className={`rounded-xl px-3 py-2.5 ${dark ? 'bg-[#141414] text-zinc-200' : 'bg-white text-zinc-800'}`}>
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-[700] text-sm">{line.name}</span>
                            <div className="flex items-center gap-2">
                              <span className={`rounded-lg border px-2 py-1 text-[10px] ${dark ? 'border-zinc-700 text-zinc-300' : 'border-zinc-200 text-zinc-600'}`}>سینگل {formatPrice(line.singlePrice)}</span>
                              <span className="rounded-lg bg-[#e30613] px-2 py-1 text-[10px] font-[800] text-white">دبل {formatPrice(line.doublePrice)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={`rounded-2xl border p-3.5 ${dark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-100 bg-zinc-50'}`}>
                    <div className="text-[13px] font-[700]">قیمت</div>
                    <div className="mt-2 text-[15px] font-[800] text-[#e30613]">{formatPrice(selectedProduct.price || 0)}</div>
                  </div>
                )}

                {canAddSyrup(selectedProduct) && (
                  <div className={`rounded-2xl border p-3.5 ${dark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-100 bg-zinc-50'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-[700]">سیروپ‌های قابل افزودن</div>
                        <p className={`mt-1 text-[11px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>قیمت هر سیروپ: {formatPrice(syrupPrice)}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#e30613] px-3 py-1.5 text-[11px] font-[800] text-white">{formatPrice(syrupPrice)}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {syrups.map((syrup) => (
                        <span key={syrup} className={`rounded-full border px-3 py-1.5 text-[11px] font-medium ${dark ? 'border-zinc-700 bg-[#141414] text-zinc-300' : 'border-zinc-200 bg-white text-zinc-700'}`}>
                          {syrup}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`rounded-2xl border p-3.5 flex items-start gap-3 ${dark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-100 bg-zinc-50'}`}>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#e30613] text-white shrink-0">✦</span>
                  <div className="flex-1">
                    <div className="text-[13px] font-[700]">پیشنهاد همراه</div>
                    <div className={`mt-1 text-xs leading-5 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>{selectedProduct.pairing || 'برای انتخاب همراه مناسب، از تیم زون بپرسید.'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className={`rounded-2xl border p-3 text-center ${dark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-100 bg-white'}`}>
                    <div className="text-lg">⏱</div>
                    <div className="mt-1 text-xs font-medium">زمان آماده‌سازی</div>
                    <div className="text-xs font-bold text-[#e30613]">{selectedProduct.prep}</div>
                  </div>
                  <div className={`rounded-2xl border p-3 text-center ${dark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-100 bg-white'}`}>
                    <div className="text-lg">🌱</div>
                    <div className="mt-1 text-xs font-medium">مواد اولیه</div>
                    <div className={`text-[11px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>تازه و روزانه</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <style>{`@keyframes sheetIn { from{ transform: translateY(24px); opacity:0 } to{ transform: translateY(0); opacity:1 } }`}</style>
        </div>
      )}

    </div>
  )
}
