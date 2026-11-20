//Hàm tính tổng tiền.
const countTotal = () => {
  //Tính toán
  let total = 0;
  if (!localStorage.getItem("cart")) total = 0;

  const cart = JSON.parse(localStorage.getItem("cart"));
  cart.forEach((item) => {
    total += item.price * 1000 * item.quantity;
  });

  localStorage.setItem("total", total);

  //Update UI
  const totalPriceHeader = document.querySelector("#total");
  const totalPriceCart = document.querySelector("#total-price span");

  totalPriceHeader.textContent = total.toLocaleString("vi-VN");
  totalPriceCart.textContent = total.toLocaleString("vi-VN");
};

// ========================= 1. showCart ================
const showCart = () => {
  if (localStorage.getItem("cart")) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const tbody = document.querySelector("table tbody");
    cart.forEach((item, index) => {
      tbody.innerHTML += `
        <tr class="text-center border-b border-[#b9b9b9] h-20 py-4 mb-4">
              <td class="h-full flex items-center gap-2 py-4">
                <img src="${item.image}" alt="" class="w-17.5" />
                ${item.name}
              </td>
              <td><span>${item.price}</span></span><sup>đ</sup></td>
              <td>
                <input
                  class="w-7.5 border border-[#aaa] rounded-sm pl-1"
                  type="number"
                  oninput="handleInput('${item.name}',this)"
                  value="${item.quantity}"
                  min="1"
                />
              </td>
              <td class="cursor-pointer" onclick="handleDelete('${item.name}',this)">Xóa</td>
            </tr>
      `;
    });

    countTotal();
  }
};

showCart();

// ========================== 2. Add Cart ==============
const addBtns = document.querySelectorAll(".product-item button");

addBtns.forEach((btn, index) => {
  //1. Thêm sự kiện
  btn.addEventListener("click", () => {
    const productItem = btn.parentElement;
    const image = productItem.querySelector("img");
    const name = productItem.querySelector("h1");
    const price = productItem.querySelector("span");

    addToCart({
      image: image.src.replace("http://127.0.0.1:5500/", ""),
      name: name.textContent,
      price: price.textContent,
      quantity: 1,
    });

    countTotal();
  });
});

//2. Hàm thêm (nhận thông tin item làm đầu vào)
const addToCart = (item) => {
  // 2.1 Kiểm tra đã tồn tại sản phẩm nào trong giỏ hàng chưa
  if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([item]));
    addUI(item, "add", -1);
  } else {
    // 2.2 Nếu đã tồn tại giỏ hàng
    const oldCart = JSON.parse(localStorage.getItem("cart"));

    // 2.2.1 Kiểm tra đã tồn tại sản phẩm.
    let isExist = false;
    let indexIfExist = -1;
    let newCart = oldCart.map((value, index) => {
      if (value.name === item.name) {
        value.quantity++;
        isExist = true;
        indexIfExist = index;
      }

      return value;
    });

    if (!isExist) {
      oldCart.push(item);
      localStorage.setItem("cart", JSON.stringify(oldCart));
      addUI(item, "add", -1);
    } else {
      localStorage.setItem("cart", JSON.stringify(newCart));
      addUI(item, "update", indexIfExist);
    }
  }
};

// 3. Hàm cập nhật UI sau thao tác thêm
//  Nhận thông tin item, loại add( thêm mới hay update số lượng) | index nếu update
const addUI = (item, type, index) => {
  const tbody = document.querySelector("table tbody");

  // 3.1 Nếu là thêm mới
  if (type === "add") {
    const tr = document.createElement("tr");
    tr.classList.add(
      "text-center",
      "border-b",
      "border-[#b9b9b9]",
      "h-20",
      "py-4",
      "mb-4",
    );
    tr.innerHTML += `
    <td class="h-full flex items-center gap-2 py-4">
                <img src="${item.image}" alt="" class="w-17.5" />
                ${item.name}
              </td>
              <td><span>${item.price}</span></span><sup>đ</sup></td>
              <td>
                <input
                  class="w-7.5 border border-[#b9b9b9] rounded-sm pl-1"
                  type="number"
                  oninput="handleInput('${item.name}',this)"
                  value="${item.quantity}"
                  min="1"
                />
              </td>
              <td class="cursor-pointer" onclick="handleDelete('${item.name}',this)">Xóa</td>
    `;

    tbody.appendChild(tr);
    return;
  }

  const tr = tbody.querySelector(`tr:nth-child(${index + 1})`);
  tr.querySelector("input").value++;
};

// ================ 4. Tăng/ giảm số lượng trong cart ==============
const handleInput = (name, inputElement) => {
  const oldCart = JSON.parse(localStorage.getItem("cart"));

  let newCart = oldCart.map((value, index) => {
    if (value.name === name) {
      value.quantity = inputElement.value;
    }
    return value;
  });
  localStorage.setItem("cart", JSON.stringify(newCart));
  countTotal();
};

// =================== 5. Xóa item =======================
const handleDelete = (name, inputElement) => {
  // Delete item from localStorage
  const oldCart = JSON.parse(localStorage.getItem("cart"));

  let newCart = oldCart.filter((item) => item.name !== name);
  localStorage.setItem("cart", JSON.stringify(newCart));

  //Update UI
  const tr = inputElement.closest("tr");
  tr.remove();
  countTotal();
};

// ================ 6. JS for Cart Section ===============
const cartSection = document.querySelector("#cart");
const cartBtn = document.querySelector("header span");
const closeBtn = document.querySelector("#cart > span");

cartBtn.addEventListener("click", () => {
  cartSection.classList.toggle("translate-x-full");
});

closeBtn.addEventListener("click", () => {
  cartSection.classList.add("translate-x-full");
});
