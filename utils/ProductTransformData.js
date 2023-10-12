function transformData(data, page,limit) {
        const transformedData = data.map((item) => {
    
          return {
            id: item._id, 
            name: item.name,
            price: item.price,
            image: item.image,
            quantity:item.quantity
          };
        });
      
        return {
            products: transformedData,
            meta: {
              total: data.length,
              page,
              limit,
              totalPages: data.total,
            },
          };
        }
  
  module.exports = {
    transformData,
  };
 