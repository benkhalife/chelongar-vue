<script>
export default{
  emits: ['changeText'],
  mounted(){
    this.theme = window.localStorage.getItem('keyboardtheme')||'theme-dark';
  },
  data(){
    return{
      simbols:[

      ],
      numbers:[
        [1,'𐏑'],
        [2,'𐏒'],
        [3 ,'𐏒𐏑'],
        [4,'𐏒𐏒'],
        [5 ,'𐏒𐏒𐏑'],
        [6 ,'𐏒𐏒𐏒'],
        [7 ,'𐏒𐏒𐏒𐏑'],
        [8 ,'𐏒𐏒𐏒𐏒'],
        [9 ,'𐏒𐏒𐏒𐏒𐏑'],
        [10 ,'𐏓'],
        [20 ,'𐏔'],
        [30 ,'𐏔𐏓'],
        [40 ,'𐏔𐏔'],
        [50 ,'𐏔𐏔𐏓'],
        [60 ,'𐏔𐏔𐏔'],
        [70 ,'𐏔𐏔𐏔𐏓'],
        [80 ,'𐏔𐏔𐏔𐏔'],
        [90 ,'𐏔𐏔𐏔𐏔𐏓'],
        [100 ,'𐏕'],
        ['زمین', '𐏏'],
        ['خدا', '𐏎'],
        ['شاه', '𐏋'],
        // ['نمادها' ,'namadha'],


      ],
      
      text:'',
      wordArray:[],
      wordArrayp:[],
      
      words:[
        ['ض', '𐏀'],
        ['ص', '𐎿'],
        ['ث', '𐎰'],
        ['ق', '𐎥'],
        ['ف', '𐎳'],
        ['غ', '𐎥'],
        ['عِ', '𐎡'],
        ['عَ', '𐎠'],
        ['ه', '𐏃'],
        ['خ', '𐎧'],
        ['ح', '𐏃'],
        ['حَ', '𐏃'],
        ['ج', '𐎩'],
        // ['جَ', '𐎩'],
        ['جِ', '𐎪'],
        ['جی', '𐎪'],
        ['ش', '𐏁'],
        ['س', '𐎿'],
        ['ی', '𐎹'],
        ['ب', '𐎲'],
        ['ل','𐎾'],
        ['آ', '𐎠'],
        ['اَ', '𐎠'],
        ['اُ', '𐎢'],
        ['اِ', '𐎡'],
        ['او', '𐎢'],
        ['ای', '𐎡'],
        ['ت', '𐎫'],
        ['تُ', '𐎬'],
        ['تو', '𐎬'],
        ['ن', '𐎴'],
        ['نُ', '𐎵'],
        // ['نَ', '𐎴'],
        ['نو', '𐎵'],
        ['م', '𐎶'],
        // ['مَ', '𐎶'],
        ['مِ', '𐎷'],
        ['مُ', '𐎸'],
        ['مو', '𐎸'],
        ['می', '𐎷'],
        ['ک', '𐎣'],
        // ['کَ', '𐎣'],
        ['کُ', '𐎤'],
        ['کو', '𐎤'],
        ['گ', '𐎥'],
        ['گَ', '𐎥'],
        ['گُ', '𐎦'],
        ['گو', '𐎦'],
        
        
        
        ['ظ', '𐏀'],
        ['ط', '𐎫'],
        ['ز', '𐏀'],
        ['ر','𐎼'],
        ['رُ','𐎽'],
        ['رو','𐎽'],
        ['د', '𐎭'],
        // ['دَ', '𐎭'],
        ['دُ', '𐎯'],
        ['دِ', '𐎮'],
        ['دو', '𐎯'],
        ['دی', '𐎮'],


        ['پ', '𐎱'],
        ['و', '𐎺'],
        ['وِ', '𐎻'],
        ['وی', '𐎻'],
        ['چ', '𐎨'],

        // ['بَ', '𐎲'],
        ['پ', '𐎱'],
        // ['پَ', '𐎱'],
        // ['تَ', '𐎫'],
        // ['ثَ', '𐎰'],
        ['ثرَ', '𐏂'],
        // ['چَ', '𐎨'],
        [',','𐏐']
      ],

      theme:'theme-dark',

      themes:
      [
        {
          name: 'پیشفرض',
          class: 'theme-dark',
        },
        {
          name: 'آبی تیره',
          class: 'theme-blue-dark',
        },
        {
          name: 'آبی',
          class: 'theme-blue',
        },

        {
          name: 'سبز',
          class: 'theme-green',
        },
        {
          name: 'خاکستری',
          class: 'theme-gray',
        },

        {
          name: 'صورتی',
          class: 'theme-pink',
        },
      ],

      page_content : 'word',

      open:true,
    }
  },

  methods:{

    selectTheme(theme){
      this.theme = theme.class;
      this.openWordBox()
      window.localStorage.setItem('keyboardtheme', theme.class);
    },

    openNumberBox(){
      this.page_content = 'number'
      
    },
    openSimbolBox(){
      this.page_content = 'simbol'
      
    },
    
    openWordBox(){
      this.page_content = 'word'
    },

    openThemesBox(){
      if(this.page_content!='themes'){
        this.page_content = 'themes'
        if(this.open ==false){
          this.toggleKeyboard();
        }
      }
      else{
        this.openWordBox()
      }
    },

    emitChange(){
      this.$emit('change-text',this.wordArray.join(''));
      this.$emit('change-textpersian',this.wordArrayp.join(''));
    },

    addText(word){
      // console.log(word);
      // if(word[1] == 'namadha'){
      //   this.openSimbolBox()
      //   return;
      // }
      
      this.text += word[1];
      this.wordArray.push(word[1]);
      this.wordArrayp.push(word[0]);
      this.emitChange();
    },

    removeLastWord(){
      this.wordArray.splice(this.wordArray.length-1, 1);
      this.wordArrayp.splice(this.wordArrayp.length-1, 1);
      this.emitChange();
    },


    nextLineWord(){
      this.wordArray.push("\n");
      this.wordArrayp.push("\n");
      this.emitChange();
    },

    space(){
      this.wordArray.push(' ');
      this.wordArrayp.push(' ');
      this.emitChange();
    },
    toggleKeyboard(){
      this.open = ! this.open;
      this.$emit('show-status',this.open);
    }
  }
}
</script>

<template>
  <div ref="keyboard" class="rounded-xl  px-1 flex flex-col gap-2 pb-10 px-1" :class="theme">

    <!-- tools -->
    <div class="flex gap-2 border-b border-gray-400/10 py-1 px-1 flex-row-reverse">
      <div @click="toggleKeyboard()" class=" rounded-lg border border-gray-400/20 bg-white/5 p-1 ">
      
        <svg v-show="open" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>

        <svg v-show="open==false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>

      </div>


      <div @click="openThemesBox()" class="rounded-lg border border-gray-400/20 bg-white/5 p-1 ">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
    </div>
    <!-- end tools -->

    <ThemeList v-show="page_content=='themes'" class="py-2 text-sm">
      <div class="text-center text-gray-200">یکی از تم های زیر را انتخاب کنید</div>
      <div class="flex gap-4 justify-center mt-4 pb-2 flex-wrap">

        <div v-for="(theme, index) of themes" :key="index">
          <div @click="selectTheme(theme)" :class="theme.class" class="w-28 text-center px-4 py-3 rounded-lg text-white border border-gray-400/50">{{ theme.name }}</div>
        </div>

      </div>
    </ThemeList>

    
    <PageNumbers v-show="page_content=='number'" class="flex gap-2 flex-wrap justify-center">
      <div @click="addText(word)" class="keyboard btn w-fit min-w-[42px] px-0.5 text-center font-bold" v-for="(word, index) of numbers" :key="index" v-text="word[0]"></div>
    </PageNumbers>

    <PageWord v-show="page_content=='word'" class="flex gap-1 flex-wrap justify-center">
      <div @click="addText(word)" class="keyboard btn w-7 text-center font-bold" v-for="(word, index) of words" :key="index" v-text="word[0]"></div>
    </PageWord>


    <ButtomTools v-show="['word', 'number', 'simbol'].indexOf(page_content)>-1" class="flex gap-2 pb-1">

      <div v-show="page_content=='word'" @click="openNumberBox()" class="keyboard btn px-2">? 123</div>
      <div v-show="page_content=='number'" @click="openWordBox()" class="keyboard btn px-2">ABC</div>
      
      <div @click="space()" class="keyboard btn flex-1"></div>
      
      
      <!-- Next Line -->
      <div @click="nextLineWord()" class="keyboard btn -scale-y-100 px-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg>
      </div>

      <!-- Undo -->
      <div @click="removeLastWord()" class="keyboard btn px-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
        </svg>
      </div>

    </ButtomTools>
  </div>
  
</template>
