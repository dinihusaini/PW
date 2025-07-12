import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://tfvzsriecpzvrnzlvwww.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdnpzcmllY3B6dnJuemx2d3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NTc5NzMsImV4cCI6MjA2NTEzMzk3M30.z1OHvDg0kkgyzmaW_BIho4tTHCXfFXSSH-KjYrPosOg'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const loginContainer = document.getElementById('login-container')
const loginForm = document.getElementById('login-form')
const loginError = document.getElementById('login-error')

const adminMenu = document.getElementById('admin-menu')
const logoutBtn = document.getElementById('logout-btn')

const productForm = document.getElementById('product-form')
const productIdInput = document.getElementById('product-id')
const productNameInput = document.getElementById('product-name')
const productQtyInput = document.getElementById('product-qty')

const productList = document.getElementById('product-list')

// Cek apakah user sudah login
async function checkSession() {
  const user = supabase.auth.user()
  if (user) {
    loginContainer.style.display = 'none'
    adminMenu.style.display = 'block'
    await loadProducts()
  } else {
    loginContainer.style.display = 'block'
    adminMenu.style.display = 'none'
  }
}

// Login handler
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value.trim()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    loginError.textContent = error.message
  } else {
    loginError.textContent = ''
    await checkSession()
  }
})

// Logout handler
logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut()
  checkSession()
})

// Load data inventaris dari Supabase
async function loadProducts() {
  const { data, error } = await supabase.from('inventaris').select('*').order('id', { ascending: true })
  if (error) {
    alert('Error loading data: ' + error.message)
    return
  }

  if (data.length === 0) {
    productList.innerHTML = '<p>Tidak ada data barang.</p>'
    return
  }

  let out = ''
  data.forEach(item => {
    out += `
      <div class="content-card">
        <h3>${item.nama}</h3>
        <p>Jumlah: ${item.jumlah}</p>
        <button data-id="${item.id}" class="edit-btn">Edit</button>
        <button data-id="${item.id}" class="delete-btn">Hapus</button>
      </div>
    `
  })
  productList.innerHTML = out

  // Event edit button
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.getAttribute('data-id')
      editProduct(id)
    })
  })

  // Event delete button
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      const id = e.target.getAttribute('data-id')
      if (confirm('Yakin ingin menghapus barang ini?')) {
        await deleteProduct(id)
      }
    })
  })
}

// Isi form dengan data produk yang diedit
async function editProduct(id) {
  const { data, error } = await supabase.from('inventaris').select('*').eq('id', id).single()
  if (error) {
    alert('Error fetching data: ' + error.message)
    return
  }
  productIdInput.value = data.id
  productNameInput.value = data.nama
  productQtyInput.value = data.jumlah
}

// Delete produk
async function deleteProduct(id) {
  const { error } = await supabase.from('inventaris').delete().eq('id', id)
  if (error) {
    alert('Error deleting data: ' + error.message)
    return
  }
  alert('Data berhasil dihapus.')
  loadProducts()
}

// Submit tambah atau update produk
productForm.addEventListener('submit', async e => {
  e.preventDefault()
  const id = productIdInput.value
  const nama = productNameInput.value.trim()
  const jumlah = parseInt(productQtyInput.value)

  if (!nama || isNaN(jumlah) || jumlah < 0) {
    alert('Mohon isi data dengan benar.')
    return
  }

  if (id) {
    // update
    const { error } = await supabase.from('inventaris').update({ nama, jumlah }).eq('id', id)
    if (error) {
      alert('Error updating data: ' + error.message)
      return
    }
    alert('Data berhasil diupdate.')
  } else {
    // insert
    const { error } = await supabase.from('inventaris').insert([{ nama, jumlah }])
    if (error) {
      alert('Error inserting data: ' + error.message)
      return
    }
    alert('Data berhasil ditambahkan.')
  }

  productForm.reset()
  productIdInput.value = ''
  loadProducts()
})

// Cancel edit, reset form
document.getElementById('cancel-edit').addEventListener('click', () => {
  productForm.reset()
  productIdInput.value = ''
})

window.addEventListener('DOMContentLoaded', () => {
  checkSession()
})
