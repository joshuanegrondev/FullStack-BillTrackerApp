const paid = document.getElementsByClassName('paid');
const pay = document.getElementsByClassName('pay');

Array.from(paid).forEach(function(element) {
      element.addEventListener('click', function(){
        console.log(this.parentNode.parentNode.childNodes);

        const _id = this.getAttribute("data-objectId")
        const debter = this.parentNode.childNodes[2].getAttribute("data-bill")
        const dbt = this.parentNode.childNodes[5].getAttribute("data-bill")
        const number = this.parentNode.childNodes[8].getAttribute("data-bill")
        const owe = this.parentNode.childNodes[11].getAttribute("data-bill")
        console.log(_id,debter,dbt,owe);
        fetch('person', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            '_id':_id
          })
        }).then(function (response) {
          console.log(response);
          window.location.reload()
        }).catch(function (err) {
          console.log(err)
        })
      });
});
Array.from(pay).forEach(function(element) {
      element.addEventListener('click', function(){
        const amount = parseInt(this.parentNode.childNodes[21].value)
        const _id = this.getAttribute("data-objectId")

        if (isNaN(amount) ) return


        console.log(amount)
        fetch('person', {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'amount':amount,
            '_id': _id
          })
        }).then(function (response) {
          console.log(response);
          window.location.reload()
        }).catch(function (err) {
          console.log(err)
        })
      });
});
