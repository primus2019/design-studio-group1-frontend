<template>
    <div class="queue">
        <div class="table_div">
            <h1>{{tables[tables_option]}}</h1>
        </div>
        <div class="number_div">
            <h1>{{numbers[current[1]]}}</h1>
        </div>
        <a class="new_button_div_container">
        <div v-on:click=new_number_prompt class="new_button_div">
            <h1>取号</h1>
        </div>
        </a>
        <a class="next_button_div_container">
        <div v-on:click=next_table class="next_button_div">
            <h1>下一桌</h1>
        </div>
        </a>
    </div>
</template>
<style>
  .table_div{
    background-color:pink;
    width:30vh;
    height:15vh;
    margin-left: 35vh;
    margin-top: 35vh;
    border-radius: 50vh;
    text-align: center;
    float:left;
  }
  .queue h1{
    font-size:10vh;
    text-align: center;
    vertical-align:middle;
    line-height:15vh;
    width:fit-content;
    margin-left: auto;
    margin-right: auto;
  }
  .number_div{
    background-color:lightgrey;
    width:50vh;
    height:25vh;
    text-align:center;
    margin-left:3vh;
    margin-top: 30vh;
    float:left;
    }
  .number_div h1{
    font-size:10vh;
    text-align: center;
    vertical-align:middle;
    line-height:25vh;
    width:fit-content;
    margin-left: auto;
    margin-right: auto;
    }
  .new_button_div{
    background-color:aliceblue;
    width: 17vh;
    border-radius: 50px;
    text-align:center;
    margin-left: 3vh;
    margin-top: 37vh;
    float: left;
    height: 10vh;
    }
  .new_button_div:hover{
    background-color:cornflowerblue;
    }
  .new_button_div h1{
    font-size:5vh;
    text-align: center;
    vertical-align:middle;
    line-height:10vh;
    margin-left: auto;
    margin-right: auto;
    color:black;
  }
  .next_button_div{
    background-color:bisque;
    width:17vh;
    height:10vh;
    border-radius: 50vh;
    text-align:center;
    margin-left: 3vh;
    margin-top: 37vh;
    float:left;
    }
  .next_button_div:hover{
    background-color:darksalmon;
  }
  .next_button_div h1{
    font-size:5vh;
    text-align: center;
    vertical-align:middle;
    line-height:10vh;
    margin-left: auto;
    margin-right: auto;
    color:black;
  }
  .new_button_div_container {
      text-decoration: none;
      display:block;
  }
  .next_button_div_container {
      text-decoration: none;
      display:block;
  }
</style>
<script>
export default {
  name: 'Queue',
  data () {
    return {
      tables: ['小桌', '中卓', '大桌'],
      tables_option: 0,
      numbers: [],
      current: 0,
      current_number: 0
    }
  },
  methods: {
    new_number_prompt () {
      var tableSelection = prompt('小桌(1)？中卓(2)？大桌(3)')
      if (tableSelection === '1') {
        this.numbers.push(['小桌', this.current_number + 1])
      } else if (tableSelection === '2') {
        this.numbers.push(['中卓', this.current_number + 1])
      } else if (tableSelection === '3') {
        this.numbers.push(['大桌', this.current_number + 1])
      } else {
        alert('错误的餐桌大小，取号失败！')
      }
    },
    next_table () {
      this.current_number = this.current_number + 1
      console.log('current_number added')
    }
  }
}
</script>
