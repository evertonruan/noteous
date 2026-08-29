function findMonth(number) {
  if (number == 0) {
    return 'Janeiro'
  } else if (number == 1) {
    return 'Fevereiro'
  } else if (number == 2) {
    return 'Março'
  } else if (number == 3) {
    return 'Abril'
  } else if (number == 4) {
    return 'Maio'
  } else if (number == 5) {
    return 'Junho'
  } else if (number == 6) {
    return 'Julho'
  } else if (number == 7) {
    return 'Agosto'
  } else if (number == 8) {
    return 'Setembro'
  } else if (number == 9) {
    return 'Outubro'
  } else if (number == 10) {
    return 'Novembro'
  } else if (number == 11) {
    return 'Dezembro'
  }
}

function setTimeNumber(number) {
  if (number < 10) {
    return `0${number}`
  }
  return `${number}`
}

function getDateString(date) {
  if (!date) return ''
  const target = new Date(date)
  const now = new Date()

  const hours = setTimeNumber(target.getHours())
  const minutes = setTimeNumber(target.getMinutes())
  const timeStr = `${hours}:${minutes}`

  const targetDateOnly = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const diffTime = nowDateOnly.getTime() - targetDateOnly.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return `Hoje, ${timeStr}`
  } else if (diffDays === 1) {
    return `Ontem, ${timeStr}`
  }

  const day = target.getDate()
  const month = findMonth(target.getMonth())

  if (target.getFullYear() === now.getFullYear()) {
    return `${day}/${month}, ${timeStr}`
  }

  const year = target.getFullYear()
  return `${day}/${month}/${year}, ${timeStr}`
}

function findWeek(number) {
  if (number == 0) {
    return 'Domingo'
  } else if (number == 1) {
    return 'Segunda-feira'
  } else if (number == 2) {
    return 'Terça-feira'
  } else if (number == 3) {
    return 'Quarta-feira'
  } else if (number == 4) {
    return 'Quinta-feira'
  } else if (number == 5) {
    return 'Sexta-feira'
  } else if (number == 6) {
    return 'Sábado'
  }
}

export { getDateString, findMonth, findWeek, setTimeNumber }