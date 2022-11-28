export default function orblendEngine(context) {
  //Local Functions
  const random = () => {
    let math = Math.random()
    if (math < 0.5) {
      return false
    } else {
      return true
    }
  }

  const dateElement = () => {
    let dateNow = new Date()
    let infoElementDate = document.createElement('p')
    infoElementDate.classList.add('info-element')
    let infoElementDateText = document.createTextNode(
      `Olá! Hoje é ${findWeek(new Date(dateNow).getDay())}, ${new Date(
        dateNow
      ).getDate()} de ${findMonth(new Date(dateNow).getMonth())}`
    )
    infoElementDate.append(infoElementDateText)
    infoPanel.append(infoElementDate)
  }

  if (context == 'change') {
    if (noteousMain.length > 2) {
      readOptionsSort.style.cssText = 'opacity: 1'
    } else {
      readOptionsSort.style.cssText = 'opacity: 0'
      console.log(random())
    }
  } else if (context == 'load') {
    if (noteousMain.length < 2) {
      readOptionsSort.style.cssText = 'opacity: 0'
    }
    dateElement()
  }
}
